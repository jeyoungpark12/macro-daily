import re
from difflib import SequenceMatcher

from ..models import Article

SIMILARITY_THRESHOLD = 0.6


def _normalize(title: str) -> str:
    title = re.sub(r"\[[^\]]*\]|\([^)]*\)", "", title)  # [속보], (종합) 등 제거
    return re.sub(r"[^\w]", "", title).lower()


def dedup(articles: list[Article]) -> list[Article]:
    """제목이 비슷한 기사를 하나로 묶는다. 대표 기사의 duplicates에 나머지를 넣는다."""
    representatives: list[tuple[str, Article]] = []
    for article in sorted(articles, key=lambda a: a.published_at):
        norm = _normalize(article.title)
        for rep_norm, rep in representatives:
            if norm == rep_norm or SequenceMatcher(None, norm, rep_norm).ratio() >= SIMILARITY_THRESHOLD:
                rep.duplicates.append(article)
                break
        else:
            representatives.append((norm, article))
    return [rep for _, rep in representatives]
