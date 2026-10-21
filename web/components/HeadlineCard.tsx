import { formatPublished } from "@/lib/format";
import type { Report } from "@/lib/reports";

export default function HeadlineCard({ report }: { report: Report }) {
  const points = report.key_points ?? [];
  return (
    <article className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-space-md md:p-space-lg">
      <div className="mb-space-md flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 pb-space-sm font-label-caption text-label-caption text-on-surface-variant">
        <span className="rounded bg-primary-container px-2 py-0.5 text-[11px] font-bold tracking-wider text-surface-bright">
          DAILY BRIEF
        </span>
        <div className="flex items-center gap-3">
          <span>발행 {formatPublished(report.generated_at)}</span>
          <span className="text-outline-variant">•</span>
          <span>기사 {report.article_count}건 분석</span>
        </div>
      </div>
      <h1 className="mb-space-sm font-headline-lg text-headline-lg text-primary">{report.headline}</h1>
      {report.lead && (
        <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">{report.lead}</p>
      )}
      {points.length > 0 && (
        <div className="mt-space-lg rounded-r-lg border-l-4 border-primary-container bg-surface-container-low p-space-md">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[1.1rem] text-primary">summarize</span>
            <h2 className="font-body-md text-body-md font-bold tracking-tight text-primary">핵심 3줄 요약</h2>
          </div>
          <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary-container" />
                <span>
                  <strong>{p.title}:</strong> {p.body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
