// history 값을 min/max 로 맞춘 인라인 SVG 선 (점이 3개 미만이면 생략)
export default function Sparkline({ values }: { values?: number[] }) {
  if (!values || values.length < 3) return null;
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values
    .map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(1)},${(22 - ((v - min) / range) * 20).toFixed(1)}`)
    .join(" ");
  // 기간 추세(처음 → 끝) 기준 색
  const first = values[0];
  const last = values[values.length - 1];
  const stroke = last > first ? "stroke-up-line" : last < first ? "stroke-down-line" : "stroke-outline";
  return (
    <svg className={`h-5 w-full fill-none ${stroke}`} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
