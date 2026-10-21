import Link from "next/link";
import SiteHeader, { MobileNav } from "@/components/SiteHeader";
import { formatReportDate } from "@/lib/format";
import { getReportIndex } from "@/lib/reports";

export default function ArchivePage() {
  const entries = getReportIndex();
  return (
    <>
      <SiteHeader active="archive" />
      <main className="mx-auto w-full max-w-[960px] flex-1 px-margin py-space-md md:px-margin-desktop md:py-space-xl">
        <section className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-space-md md:p-space-lg">
          <div className="mb-space-md flex items-center justify-between border-b border-outline-variant/40 pb-space-sm font-label-caption text-label-caption text-on-surface-variant">
            <span className="rounded bg-primary-container px-2 py-0.5 text-[11px] font-bold tracking-wider text-surface-bright">
              ARCHIVE
            </span>
            <span>총 {entries.length}건</span>
          </div>
          <h1 className="mb-space-md font-headline-lg text-headline-lg text-primary">지난 브리핑</h1>
          {entries.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">아직 생성된 보고서가 없습니다.</p>
          ) : (
            <ul className="divide-y divide-outline-variant/40 border-t border-outline-variant/40">
              {entries.map((e) => (
                <li key={e.date}>
                  <Link
                    href={`/report/${e.date}/`}
                    className="group flex items-center gap-space-md py-space-md transition-colors hover:bg-surface"
                  >
                    <time
                      dateTime={e.date}
                      className="w-28 shrink-0 font-label-caption text-label-caption font-semibold tabular-nums text-on-surface-variant md:w-36"
                    >
                      {formatReportDate(e.date)}
                    </time>
                    <span className="min-w-0 flex-1 font-headline-sm text-headline-sm text-primary group-hover:underline">
                      {e.headline}
                    </span>
                    <span className="material-symbols-outlined shrink-0 text-on-surface-variant">chevron_right</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <MobileNav active="archive" />
    </>
  );
}
