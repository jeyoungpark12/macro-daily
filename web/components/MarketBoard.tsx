import { direction, formatDelta, formatValue, PILL } from "@/lib/format";
import type { Indicator } from "@/lib/reports";
import Sparkline from "./Sparkline";

export default function MarketBoard({ indicators }: { indicators: Indicator[] }) {
  const market = indicators.filter((i) => i.group === "시장");
  if (market.length === 0) return null;
  return (
    <section className="rounded-lg border border-outline-variant/80 bg-surface-container-lowest p-space-md">
      <div className="mb-space-sm flex items-center justify-between border-b border-outline-variant/40 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[1.1rem] text-primary">monitoring</span>
          <h2 className="font-headline-sm text-headline-sm font-semibold text-primary">글로벌 마켓 보드</h2>
        </div>
        <span className="text-label-caption text-on-surface-variant">전일 종가 기준</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {market.map((i) => (
          <a
            key={i.name}
            href={i.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between rounded border border-outline-variant/40 bg-surface p-2.5 transition-colors hover:border-outline"
          >
            <div className="flex items-start justify-between gap-1">
              <span className="text-label-caption font-bold text-on-surface-variant">{i.name}</span>
              <span className={`shrink-0 rounded border px-1 text-[10px] font-bold tabular-nums ${PILL[direction(i.change)]}`}>
                {formatDelta(i)}
              </span>
            </div>
            <div className="my-1 font-metric-stat-md text-metric-stat-md tabular-nums text-on-surface">{formatValue(i)}</div>
            <Sparkline values={i.history} />
          </a>
        ))}
      </div>
    </section>
  );
}
