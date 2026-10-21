import csv
import io
from datetime import date, timedelta

import httpx

from ..collectors.rss import USER_AGENT

CSV_URL = "https://fred.stlouisfed.org/graph/fredgraph.csv"


def fetch_series(series_id: str, target: date) -> list[tuple[date, float]]:
    """target 이하 날짜의 관측값 (오래된 순). 전년동월비 + 스파크라인(20개월)을 위해 약 3년치를 받는다."""
    resp = httpx.get(
        CSV_URL,
        params={"id": series_id, "cosd": (target - timedelta(days=1150)).isoformat(), "coed": target.isoformat()},
        headers={"User-Agent": USER_AGENT},
        timeout=30,
        follow_redirects=True,
    )
    resp.raise_for_status()
    points = []
    for row in csv.DictReader(io.StringIO(resp.text)):
        value = row[series_id]
        if value in (".", ""):  # FRED는 결측치를 "."로 표기
            continue
        points.append((date.fromisoformat(row["observation_date"]), float(value)))
    return points


def to_yoy(points: list[tuple[date, float]]) -> list[tuple[date, float]]:
    """월별 지수 → 전년동월비(%)."""
    by_month = {(d.year, d.month): v for d, v in points}
    result = []
    for d, v in points:
        prev = by_month.get((d.year - 1, d.month))
        if prev:
            result.append((d, (v / prev - 1) * 100))
    return result


def source_url(series_id: str) -> str:
    return f"https://fred.stlouisfed.org/series/{series_id}"
