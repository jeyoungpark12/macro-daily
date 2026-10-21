import argparse
import logging
from datetime import date, datetime, timedelta

from dotenv import load_dotenv

from .collectors import build_collectors
from .config import KST, ROOT_DIR, load_categories, load_sources
from .indicators import fetch_indicators
from .models import Article, Report, ReportItem, ReportSection, SourceRef
from .processing.categorize import categorize
from .processing.dedup import dedup
from .processing.filter import filter_by_date
from .storage import save_report

log = logging.getLogger("macro_daily")


def collect_all() -> list[Article]:
    articles = []
    for collector in build_collectors(load_sources()):
        try:
            found = collector.collect()
            log.info("%s: %d건", collector.name, len(found))
            articles.extend(found)
        except Exception as e:  # 소스 하나가 죽어도 나머지는 계속
            log.warning("%s 수집 실패: %s", collector.name, e)
    return articles


def _raw_sections(articles: list[Article]) -> list[ReportSection]:
    """--dry-run용: LLM 없이 카테고리별로 기사 제목만 나열."""
    by_cat: dict[str, list[ReportItem]] = {}
    for a in articles:
        by_cat.setdefault(a.categories[0], []).append(
            ReportItem(title=a.title, summary=a.description, why_it_matters="", sources=[SourceRef(a.source, a.url)])
        )
    return [ReportSection(category=c, items=items) for c, items in by_cat.items()]


def run(target: date, dry_run: bool = False) -> None:
    categories = load_categories()

    articles = collect_all()
    articles = filter_by_date(articles, target)
    articles = categorize(articles, categories)
    articles = dedup(articles)
    log.info("%s 거시경제 기사 %d건 (중복 제거 후)", target, len(articles))

    if not articles:
        log.warning("기사가 없어 보고서를 만들지 않음")
        return

    indicators = fetch_indicators(target)

    if dry_run:
        headline = f"{target.month}월 {target.day}일 거시경제 주요 뉴스"
        lead, key_points, sections = "", [], _raw_sections(articles)
    else:
        from .summarizer.llm import summarize
        s = summarize(articles, indicators, target.isoformat(), list(categories))
        headline, lead, key_points, sections = s.headline, s.lead, s.key_points, s.sections

    report = Report(
        date=target.isoformat(),
        generated_at=datetime.now(KST).isoformat(timespec="seconds"),
        headline=headline,
        sections=sections,
        article_count=len(articles),
        indicators=indicators,
        lead=lead,
        key_points=key_points,
    )
    path = save_report(report)
    log.info("저장: %s", path)


def main() -> None:
    parser = argparse.ArgumentParser(description="전날 거시경제 뉴스 보고서 생성")
    parser.add_argument("--date", type=date.fromisoformat, help="보고 대상 날짜 (기본: 어제, KST)")
    parser.add_argument("--dry-run", action="store_true", help="LLM 요약 없이 수집 결과만 저장")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    load_dotenv(ROOT_DIR / ".env")

    target = args.date or (datetime.now(KST).date() - timedelta(days=1))
    run(target, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
