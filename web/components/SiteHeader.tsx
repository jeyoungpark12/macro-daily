import Link from "next/link";
import { formatReportDate } from "@/lib/format";
import type { Indicator } from "@/lib/reports";
import TickerBar from "./TickerBar";

export type NavKey = "brief" | "archive";

const NAV: { key: NavKey; href: string; label: string; short: string; icon: string }[] = [
  { key: "brief", href: "/", label: "일간 브리핑", short: "일간 브리핑", icon: "article" },
  { key: "archive", href: "/archive/", label: "스크랩/아카이브", short: "아카이브", icon: "bookmark" },
];

export default function SiteHeader({
  active,
  date,
  indicators,
}: {
  active: NavKey;
  date?: string;
  indicators?: Indicator[];
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-outline-variant/60 bg-surface/95 shadow-sm backdrop-blur-md">
      <div className="flex w-full flex-col gap-space-xs px-margin py-space-sm md:px-margin-desktop">
        <div className="flex items-center justify-between gap-space-sm">
          <Link
            href="/"
            className="flex items-center gap-2 font-headline-sm text-headline-sm font-semibold tracking-tight text-primary md:font-headline-md md:text-headline-md"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-xs bg-primary-container" />
            모닝 매크로 브리핑
          </Link>
          {date && (
            <div className="flex shrink-0 items-center gap-1.5 rounded border border-outline-variant/60 bg-surface-container-low px-2.5 py-1 font-label-caption text-label-caption font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[1rem] text-on-surface-variant">calendar_today</span>
              <time dateTime={date}>{formatReportDate(date)}</time>
            </div>
          )}
        </div>
        {/* 모바일에서는 하단 고정 내비(MobileNav)로 대체 */}
        <nav className="hidden items-center gap-space-lg pt-1 md:flex">
          {NAV.map((n) =>
            n.key === active ? (
              <Link
                key={n.key}
                href={n.href}
                aria-current="page"
                className="flex items-center gap-1.5 border-b-2 border-primary pb-1 font-body-md text-body-md font-semibold text-primary"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {n.label}
              </Link>
            ) : (
              <Link
                key={n.key}
                href={n.href}
                className="pb-1 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      {indicators && <TickerBar indicators={indicators} />}
    </header>
  );
}

export function MobileNav({ active }: { active: NavKey }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-outline-variant bg-surface-container-lowest px-gutter py-space-xs md:hidden">
      {NAV.map((n) => {
        const on = n.key === active;
        return (
          <Link
            key={n.key}
            href={n.href}
            aria-current={on ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-space-xs ${on ? "font-semibold text-primary" : "font-medium text-on-surface-variant"}`}
          >
            <span className="material-symbols-outlined" style={on ? { fontVariationSettings: '"FILL" 1' } : undefined}>
              {n.icon}
            </span>
            <span className="mt-0.5 font-label-caption text-label-caption">{n.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}
