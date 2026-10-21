from ..models import Article
from .base import Collector


class HtmlCollector(Collector):
    """RSS가 없는 사이트용. 사이트마다 구조가 달라 소스별로 서브클래스를 만들어 쓴다.

    스크래핑 전에 해당 사이트의 robots.txt와 이용약관을 확인할 것.

    예시:
        class ExampleCollector(HtmlCollector):
            def collect(self):
                html = httpx.get(self.url, timeout=20).text
                soup = BeautifulSoup(html, "html.parser")
                for a in soup.select("ul.news-list li a"):
                    ...
    """

    def collect(self) -> list[Article]:
        raise NotImplementedError(f"{self.name}: HtmlCollector를 상속해 collect()를 구현하세요")
