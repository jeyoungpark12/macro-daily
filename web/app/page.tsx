import ReportView from "@/components/ReportView";
import SiteHeader, { MobileNav } from "@/components/SiteHeader";
import { getLatestReport } from "@/lib/reports";

export default function HomePage() {
  const report = getLatestReport();
  if (report) return <ReportView report={report} />;
  return (
    <>
      <SiteHeader active="brief" />
      <main className="mx-auto w-full max-w-[1520px] flex-1 px-margin py-space-xl md:px-margin-desktop">
        <p className="text-body-md text-on-surface-variant">아직 생성된 보고서가 없습니다.</p>
      </main>
      <MobileNav active="brief" />
    </>
  );
}
