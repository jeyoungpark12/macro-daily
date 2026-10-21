from datetime import date, datetime, time, timedelta

from ..config import KST
from ..models import Article


def day_window(target: date) -> tuple[datetime, datetime]:
    """target 날짜의 KST 00:00 ~ 다음날 00:00."""
    start = datetime.combine(target, time.min, tzinfo=KST)
    return start, start + timedelta(days=1)


def filter_by_date(articles: list[Article], target: date) -> list[Article]:
    start, end = day_window(target)
    return [a for a in articles if start <= a.published_at < end]
