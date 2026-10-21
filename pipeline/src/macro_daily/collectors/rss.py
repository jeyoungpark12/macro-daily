import calendar
from datetime import datetime, timezone

import feedparser
import httpx
from bs4 import BeautifulSoup

from ..models import Article
from .base import Collector

USER_AGENT = "Mozilla/5.0 (compatible; macro-daily/0.1)"


class RssCollector(Collector):
    def collect(self) -> list[Article]:
        resp = httpx.get(self.url, headers={"User-Agent": USER_AGENT}, timeout=20, follow_redirects=True)
        resp.raise_for_status()
        feed = feedparser.parse(resp.content)

        articles = []
        for entry in feed.entries:
            published = entry.get("published_parsed") or entry.get("updated_parsed")
            if not published:
                continue
            articles.append(
                Article(
                    title=entry.get("title", "").strip(),
                    url=entry.get("link", ""),
                    source=self.name,
                    published_at=datetime.fromtimestamp(calendar.timegm(published), tz=timezone.utc),
                    description=_strip_html(entry.get("summary", "")),
                    lang=self.lang,
                )
            )
        return articles


def _strip_html(text: str) -> str:
    return BeautifulSoup(text, "html.parser").get_text(" ", strip=True)[:500]
