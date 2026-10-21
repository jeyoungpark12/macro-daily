import { DELTA_TEXT, direction, formatAsOf, formatDelta, formatValue } from "@/lib/format";
import type { Indicator } from "@/lib/reports";

const GROUPS = ["금리", "경제지표"];

export default function RatesPanel({ indicators }: { indicators: Indicator[] }) {
  const groups = GROUPS.map((g) => ({ g, rows: indicators.filter((i) => i.group === g) })).filter(
    (x) => x.rows.length > 0,
  );
  if (groups.length === 0) return null;
  return (
    <section className="rounded-lg border border-outline-variant/80 bg-surface-container-lowest p-space-md">
      <div className="mb-space-sm flex items-center gap-1.5 border-b border-outline-variant/40 pb-2">
        <span className="material-symbols-outlined text-[1.1rem] text-primary">account_balance</span>
        <h2 className="font-headline-sm text-headline-sm font-semibold text-primary">금리 · 경제지표</h2>
      </div>
      {groups.map(({ g, rows }) => (
        <div key={g} className="mt-space-md first:mt-0">
          <h3 className="mb-1 text-label-tag text-on-surface-variant">{g}</h3>
          <ul className="divide-y divide-outline-variant/40">
            {rows.map((i) => (
              <li key={i.name}>
                <a
                  href={i.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 py-2 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-body-sm font-semibold text-on-surface">{i.name}</span>
                    <span className="block text-[11px] text-on-surface-variant">{formatAsOf(i)}</span>
                  </span>
                  <span className="shrink-0 text-right tabular-nums">
                    <span className="block text-body-sm font-bold text-on-surface">{formatValue(i)}</span>
                    <span className={`block text-[11px] font-semibold ${DELTA_TEXT[direction(i.change)]}`}>
                      {formatDelta(i)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
