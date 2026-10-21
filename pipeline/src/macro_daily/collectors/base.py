from abc import ABC, abstractmethod

from ..models import Article


class Collector(ABC):
    def __init__(self, name: str, url: str, lang: str = "ko"):
        self.name = name
        self.url = url
        self.lang = lang

    @abstractmethod
    def collect(self) -> list[Article]:
        """소스에서 최근 기사를 가져온다. 날짜 필터링은 processing 단계에서 한다."""
