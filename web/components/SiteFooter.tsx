const SOURCES = [
  "Bloomberg",
  "CNBC",
  "Yahoo Finance",
  "WSJ",
  "MarketWatch",
  "Financial Times",
  "Federal Reserve",
  "연합뉴스",
  "한국경제",
  "매일경제",
  "FRED",
];

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-outline-variant bg-surface-container px-margin pb-28 pt-space-xl text-body-sm text-on-surface-variant md:px-margin-desktop md:pb-space-xl">
      <div className="mx-auto flex max-w-[1520px] flex-col gap-1">
        <div className="font-headline-sm text-headline-sm font-semibold text-primary">모닝 매크로 브리핑</div>
        <p className="max-w-2xl font-label-caption text-label-caption">
          데이터 출처: {SOURCES.join(", ")}
          <br />
          뉴스 요약과 지표는 자동으로 수집·생성되며 투자 참고용입니다. 원문과 원 데이터를 함께 확인하세요.
        </p>
      </div>
    </footer>
  );
}
