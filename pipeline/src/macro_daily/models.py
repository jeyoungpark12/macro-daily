from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class Article:
    title: str
    url: str
    source: str
    published_at: datetime
    description: str = ""
    lang: str = "ko"
    categories: list[str] = field(default_factory=list)
    # 같은 사건을 다룬 다른 기사들 (dedup 단계에서 채움)
    duplicates: list["Article"] = field(default_factory=list)


@dataclass
class SourceRef:
    name: str
    url: str


@dataclass
class Impact:
    label: str  # 짧은 시장영향 태그 (예: "시장 호재: 지수 상승 견인")
    tone: str  # positive / negative / neutral


@dataclass
class ReportItem:
    title: str
    summary: str
    why_it_matters: str
    sources: list[SourceRef]
    impact: Impact | None = None


@dataclass
class ReportSection:
    category: str
    items: list[ReportItem]


@dataclass
class Indicator:
    name: str
    group: str  # 시장 / 금리 / 경제지표
    value: float
    change: float  # 직전 관측값 대비 (금리·% 지표는 %p)
    change_pct: float | None
    unit: str
    decimals: int
    as_of: str  # 값의 기준일 (월별 지표는 해당 월 1일)
    source_url: str
    # 스파크라인용 최근 관측값 (오래된 순, 최대 20개)
    history: list[float] = field(default_factory=list)


@dataclass
class KeyPoint:
    title: str
    body: str


@dataclass
class Report:
    date: str  # YYYY-MM-DD (보고 대상 날짜 = 전날)
    generated_at: str  # ISO 8601
    headline: str
    sections: list[ReportSection]
    article_count: int
    indicators: list[Indicator] = field(default_factory=list)
    lead: str = ""  # 오늘 흐름 개요 2~3문장
    key_points: list[KeyPoint] = field(default_factory=list)  # 핵심 3줄 요약
