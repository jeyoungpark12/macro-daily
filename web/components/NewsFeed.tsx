"use client";

import { useState } from "react";
import type { ReportSection } from "@/lib/reports";
import NewsCard from "./NewsCard";

const ALL = "전체보기";

// 카테고리 칩으로 기사 카드를 거름 (클라이언트 상태만 사용)
export default function NewsFeed({ sections }: { sections: ReportSection[] }) {
  const [active, setActive] = useState(ALL);
  const shown = active === ALL ? sections : sections.filter((s) => s.category === active);
  const count = shown.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="flex flex-col gap-space-md md:gap-space-lg">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/60 pb-2">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
          <span className="mr-2 hidden shrink-0 items-center gap-1 text-body-sm font-bold text-primary md:flex">
            <span className="material-symbols-outlined text-[1rem]">tune</span>
            카테고리
          </span>
          {[ALL, ...sections.map((s) => s.category)].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={c === active}
              onClick={() => setActive(c)}
              className={
                c === active
                  ? "shrink-0 whitespace-nowrap rounded border border-primary-container bg-primary-container px-3 py-1 font-label-caption text-label-caption font-bold text-surface-bright"
                  : "shrink-0 whitespace-nowrap rounded border border-outline-variant/50 bg-surface-container-lowest px-3 py-1 font-label-caption text-label-caption text-on-surface-variant transition-colors hover:bg-surface-container-high"
              }
            >
              {c}
            </button>
          ))}
        </div>
        <span className="shrink-0 text-label-caption text-on-surface-variant">{count}건</span>
      </div>
      {shown.flatMap((s) =>
        s.items.map((item, i) => <NewsCard key={`${s.category}-${i}`} item={item} category={s.category} />),
      )}
    </div>
  );
}
