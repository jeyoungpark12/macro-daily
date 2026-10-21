import type { Report } from "@/lib/reports";
import HeadlineCard from "./HeadlineCard";
import MarketBoard from "./MarketBoard";
import NewsFeed from "./NewsFeed";
import RatesPanel from "./RatesPanel";
import SiteHeader, { MobileNav } from "./SiteHeader";

// 데스크톱 8/4 칼럼. 모바일은 헤드라인 → 마켓 보드 → 기사 순으로 쌓임
// 사이드바가 두 줄에 걸쳐 있어서, 필터로 기사가 줄면 남는 높이가 첫 줄(헤드라인)로 가지 않도록
// 둘째 줄을 1fr로 둔다 (안 그러면 탭을 누를 때마다 탭 위에 빈 공간이 생김)
export default function ReportView({ report }: { report: Report }) {
  const indicators = report.indicators ?? [];
  return (
    <>
      <SiteHeader active="brief" date={report.date} indicators={indicators} />
      <main className="mx-auto w-full max-w-[1520px] flex-1 px-margin py-space-md md:px-margin-desktop md:py-space-xl">
        <div className="grid grid-cols-12 items-start gap-space-lg lg:grid-rows-[auto_1fr] lg:gap-space-xl">
          <div className="col-span-12 lg:col-span-8">
            <HeadlineCard report={report} />
          </div>
          {indicators.length > 0 && (
            <aside className="col-span-12 flex flex-col gap-space-lg lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
              <MarketBoard indicators={indicators} />
              <RatesPanel indicators={indicators} />
            </aside>
          )}
          <section className="col-span-12 lg:col-span-8">
            <NewsFeed sections={report.sections} />
          </section>
        </div>
      </main>
      <MobileNav active="brief" />
    </>
  );
}
