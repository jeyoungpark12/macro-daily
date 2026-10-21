from ..models import Article


def categorize(articles: list[Article], categories: dict[str, list[str]]) -> list[Article]:
    """키워드로 카테고리를 붙이고, 어느 카테고리에도 안 걸리는 기사는 버린다."""
    result = []
    for article in articles:
        text = f"{article.title} {article.description}".lower()
        article.categories = [
            name for name, keywords in categories.items()
            if any(kw.lower() in text for kw in keywords)
        ]
        if article.categories:
            result.append(article)
    return result
