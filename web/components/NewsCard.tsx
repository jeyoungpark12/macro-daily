import type { ImpactTone, ReportItem } from "@/lib/reports";

// 국내 관례: 호재 빨강 / 악재 파랑 / 중립 앰버
const IMPACT: Record<ImpactTone, string> = {
  positive: "bg-up-bg text-up border-up-border",
  negative: "bg-down-bg text-down border-down-border",
  neutral: "bg-neutral-tag-bg text-neutral-tag border-neutral-tag-border",
};

export default function NewsCard({ item, category }: { item: ReportItem; category: string }) {
  const sourceNames = [...new Set(item.sources.map((s) => s.name))].join(" · ");
  return (
    <article className="rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-space-md transition-all hover:border-outline md:p-space-lg">
      <div className="mb-space-xs flex flex-wrap items-center justify-between gap-2 font-label-caption text-label-caption">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded bg-surface-container-high px-2 py-0.5 font-bold tracking-wider text-on-surface">
            {category}
          </span>
          {sourceNames && <span className="truncate text-on-surface-variant">출처: {sourceNames}</span>}
        </div>
        {item.impact && (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${IMPACT[item.impact.tone] ?? IMPACT.neutral}`}
          >
            {item.impact.label}
          </span>
        )}
      </div>
      <h2 className="mb-2 mt-1 font-headline-md text-headline-md font-semibold text-primary">{item.title}</h2>
      {item.summary && (
        <p className="mb-3 font-body-md text-body-sm leading-relaxed text-on-surface-variant md:text-body-md">
          {item.summary}
        </p>
      )}
      <div className="flex flex-col gap-2 border-t border-outline-variant/40 pt-2 text-body-sm md:flex-row md:items-start md:justify-between">
        {item.why_it_matters ? (
          <div className="flex items-start gap-2 text-[12px] text-on-surface-variant">
            <span className="material-symbols-outlined mt-0.5 text-[15px] text-primary">insights</span>
            <span>
              <strong>시장 의미:</strong> {item.why_it_matters}
            </span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-1">
          {item.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:underline"
            >
              {s.name} 원문 <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
