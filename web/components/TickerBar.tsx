import { direction, formatDelta, formatValue, PILL } from "@/lib/format";
import type { Indicator } from "@/lib/reports";

// 전일 마감 시세 띠: 시장 그룹 + 미국채 10년 (모바일에서는 마켓 보드가 대신함)
export default function TickerBar({ indicators }: { indicators: Indicator[] }) {
  const items = [
    ...indicators.filter((i) => i.group === "시장"),
    ...indicators.filter((i) => i.name === "미국채 10년"),
  ];
  if (items.length === 0) return null;
  return (
    <div className="no-scrollbar hidden w-full overflow-x-auto border-t border-outline-variant/40 bg-surface-container-lowest px-margin-desktop py-1.5 text-label-tag md:block">
      <div className="flex w-max min-w-full items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-2 border-r border-outline-variant/50 pr-4">
          <span className="inline-block h-2 w-2 rounded-full bg-primary-container" />
          <span className="font-bold tracking-wider text-on-surface-variant">OVERNIGHT CLOSE</span>
        </div>
        {items.map((i) => (
          <div key={i.name} className="flex shrink-0 items-center gap-2">
            <span className="font-semibold text-on-surface">{i.name}</span>
            <span className="font-bold tabular-nums text-on-surface">{formatValue(i)}</span>
            <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] tabular-nums ${PILL[direction(i.change)]}`}>
              {formatDelta(i)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
