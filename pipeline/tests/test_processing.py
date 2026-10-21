from datetime import date, datetime

import pytest

from macro_daily.config import KST
from macro_daily.models import Article
from macro_daily.processing.categorize import categorize
from macro_daily.processing.dedup import dedup
from macro_daily.processing.filter import filter_by_date


def make(title: str, hour: int = 10, day: int = 20, desc: str = "") -> Article:
    return Article(
        title=title,
        url=f"https://example.com/{title}",
        source="test",
        published_at=datetime(2026, 10, day, hour, tzinfo=KST),
        description=desc,
    )


def test_filter_by_date_uses_kst_day():
    articles = [make("a", day=19, hour=23), make("b", day=20, hour=0), make("c", day=21, hour=0)]
    assert [a.title for a in filter_by_date(articles, date(2026, 10, 20))] == ["b"]


def test_categorize_drops_unrelated():
    cats = {"통화정책": ["기준금리"], "물가": ["CPI"]}
    result = categorize([make("한은 기준금리 동결"), make("연예 뉴스")], cats)
    assert len(result) == 1
    assert result[0].categories == ["통화정책"]


def test_dedup_merges_similar_titles():
    articles = [make("[속보] 한은, 기준금리 연 2.50% 동결", hour=9), make("한은 기준금리 연 2.50% 동결(종합)", hour=11)]
    result = dedup(articles)
    assert len(result) == 1
    assert len(result[0].duplicates) == 1


def test_fred_yoy():
    from macro_daily.indicators.fred import to_yoy

    points = [(date(2025, 9, 1), 100.0), (date(2025, 10, 1), 101.0), (date(2026, 9, 1), 103.0)]
    assert to_yoy(points) == [(date(2026, 9, 1), pytest.approx(3.0))]


def test_build_indicator_history():
    from datetime import timedelta

    from macro_daily.indicators import build_indicator

    points = [(date(2026, 1, 1) + timedelta(days=i), 100 + i / 3) for i in range(30)]
    spec = {"name": "X", "group": "시장", "unit": "", "decimals": 2}
    ind = build_indicator(spec, points, "https://example.com")
    assert len(ind.history) == 20
    assert ind.history[0] == round(100 + 10 / 3, 4)
    assert ind.history[-1] == ind.value
    assert ind.as_of == "2026-01-30"
    # 관측값이 20개보다 적으면 전부
    assert len(build_indicator(spec, points[:5], "").history) == 5
