from datetime import date, datetime
from zoneinfo import ZoneInfo

import httpx

from ..collectors.rss import USER_AGENT

CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"


def fetch_closes(symbol: str, target: date) -> list[tuple[date, float]]:
    """target 이하 날짜의 일별 종가 (오래된 순). 날짜는 거래소 현지 기준."""
    resp = httpx.get(
        CHART_URL.format(symbol=symbol),
        params={"range": "3mo", "interval": "1d"},
        headers={"User-Agent": USER_AGENT},
        timeout=20,
    )
    resp.raise_for_status()
    result = resp.json()["chart"]["result"][0]
    tz = ZoneInfo(result["meta"]["exchangeTimezoneName"])
    closes = result["indicators"]["quote"][0]["close"]

    points = []
    for ts, close in zip(result["timestamp"], closes):
        day = datetime.fromtimestamp(ts, tz).date()
        if close is not None and day <= target:
            points.append((day, close))
    return points


def source_url(symbol: str) -> str:
    return f"https://finance.yahoo.com/quote/{symbol}"
