import json
from dataclasses import dataclass

import anthropic

from ..models import Article, Impact, Indicator, KeyPoint, ReportItem, ReportSection, SourceRef
from .prompts import SYSTEM_PROMPT, build_user_prompt

MODEL = "claude-opus-5-5"

_SOURCE = {
    "type": "object",
    "properties": {"name": {"type": "string"}, "url": {"type": "string"}},
    "required": ["name", "url"],
    "additionalProperties": False,
}
_IMPACT = {
    "type": "object",
    "properties": {
        "label": {"type": "string", "description": "12자 안팎 시장영향 태그"},
        "tone": {"type": "string", "enum": ["positive", "negative", "neutral"]},
    },
    "required": ["label", "tone"],
    "additionalProperties": False,
}
_KEY_POINT = {
    "type": "object",
    "properties": {
        "title": {"type": "string", "description": "짧은 굵은 제목"},
        "body": {"type": "string", "description": "수치를 포함한 1~2문장"},
    },
    "required": ["title", "body"],
    "additionalProperties": False,
}
_ITEM = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string", "description": "2~3문장 요약"},
        "why_it_matters": {"type": "string", "description": "시장/투자 관점의 의미 1문장"},
        "sources": {"type": "array", "items": _SOURCE},
        "impact": _IMPACT,
    },
    "required": ["title", "summary", "why_it_matters", "sources", "impact"],
    "additionalProperties": False,
}
REPORT_SCHEMA = {
    "type": "object",
    "properties": {
        "headline": {"type": "string"},
        "lead": {"type": "string", "description": "오늘 흐름 개요 2~3문장"},
        "key_points": {"type": "array", "items": _KEY_POINT, "description": "정확히 3개"},
        "sections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "category": {"type": "string"},
                    "items": {"type": "array", "items": _ITEM},
                },
                "required": ["category", "items"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["headline", "lead", "key_points", "sections"],
    "additionalProperties": False,
}


@dataclass
class Summary:
    headline: str
    lead: str
    key_points: list[KeyPoint]
    sections: list[ReportSection]


def _format_articles(articles: list[Article]) -> str:
    lines = []
    for i, a in enumerate(articles, 1):
        related = "".join(f"\n   - 관련: {d.source} | {d.title} | {d.url}" for d in a.duplicates)
        lines.append(
            f"{i}. [{', '.join(a.categories)}] {a.source} | {a.title}\n"
            f"   URL: {a.url}\n"
            f"   내용: {a.description}{related}"
        )
    return "\n".join(lines)


def _format_indicators(indicators: list[Indicator]) -> str:
    return "\n".join(
        f"- {i.name}: {i.value:.{i.decimals}f}{i.unit} (직전 대비 {i.change:+.{i.decimals}f}, 기준일 {i.as_of})"
        for i in indicators
    )


def summarize(
    articles: list[Article], indicators: list[Indicator], report_date: str, categories: list[str]
) -> Summary:
    client = anthropic.Anthropic()
    prompt = build_user_prompt(report_date, _format_articles(articles), _format_indicators(indicators), categories)
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": REPORT_SCHEMA}},
        # 안전 분류기가 요청을 거절하면 서버가 다른 모델로 자동 재시도
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
    )
    if response.stop_reason == "refusal":
        raise RuntimeError(f"요약 요청이 거절됨: {response.stop_details}")
    if response.stop_reason == "max_tokens":
        raise RuntimeError("출력이 max_tokens에서 잘림")

    text = next(b.text for b in response.content if b.type == "text")
    data = json.loads(text)
    sections = [
        ReportSection(
            category=s["category"],
            items=[
                ReportItem(
                    title=it["title"],
                    summary=it["summary"],
                    why_it_matters=it["why_it_matters"],
                    sources=[SourceRef(**src) for src in it["sources"]],
                    impact=Impact(**it["impact"]),
                )
                for it in s["items"]
            ],
        )
        for s in data["sections"]
    ]
    return Summary(
        headline=data["headline"],
        lead=data["lead"],
        key_points=[KeyPoint(**kp) for kp in data["key_points"]],
        sections=sections,
    )
