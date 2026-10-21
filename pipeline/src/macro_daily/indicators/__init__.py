import logging
from datetime import date

from ..config import load_indicator_specs
from ..models import Indicator
from . import fred, yahoo

log = logging.getLogger("macro_daily")

HISTORY_LEN = 20


def _fetch_one(spec: dict, target: date) -> Indicator:
    if spec["source"] == "yahoo":
        points = yahoo.fetch_closes(spec["symbol"], target)
        url = yahoo.source_url(spec["symbol"])
    elif spec["source"] == "fred":
        points = fred.fetch_series(spec["symbol"], target)
        if spec.get("transform") == "yoy":
            points = fred.to_yoy(points)
        url = fred.source_url(spec["symbol"])
    else:
        raise ValueError(f"알 수 없는 source: {spec['source']}")
    return build_indicator(spec, points, url)


def build_indicator(spec: dict, points: list[tuple[date, float]], url: str) -> Indicator:
    """관측값 목록(오래된 순)으로 Indicator를 만든다."""
    if len(points) < 2:
        raise ValueError("데이터가 부족함")
    (as_of, value), (_, prev) = points[-1], points[-2]
    return Indicator(
        name=spec["name"],
        group=spec["group"],
        value=round(value, 4),
        change=round(value - prev, 4),
        # % 단위 지표(금리, CPI 등)는 변동률이 무의미하므로 %p 변화(change)만 쓴다
        change_pct=round((value / prev - 1) * 100, 2) if prev and spec.get("unit") != "%" else None,
        unit=spec.get("unit", ""),
        decimals=spec.get("decimals", 2),
        as_of=as_of.isoformat(),
        source_url=url,
        history=[round(v, 4) for _, v in points[-HISTORY_LEN:]],
    )


def fetch_indicators(target: date) -> list[Indicator]:
    specs = load_indicator_specs()
    indicators = []
    for spec in specs:
        try:
            indicators.append(_fetch_one(spec, target))
        except Exception as e:  # 지표 하나가 실패해도 보고서는 만든다
            log.warning("지표 %s 수집 실패: %s", spec["name"], e)
    log.info("지표 %d/%d개 수집", len(indicators), len(specs))
    return indicators
