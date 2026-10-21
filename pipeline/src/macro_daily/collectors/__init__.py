from .base import Collector
from .html_scraper import HtmlCollector
from .rss import RssCollector

COLLECTOR_TYPES: dict[str, type[Collector]] = {
    "rss": RssCollector,
    "html": HtmlCollector,
}


def build_collectors(sources: list[dict]) -> list[Collector]:
    return [
        COLLECTOR_TYPES[s["type"]](name=s["name"], url=s["url"], lang=s.get("lang", "ko"))
        for s in sources
    ]
