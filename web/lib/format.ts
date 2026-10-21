import type { Indicator } from "./reports";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-10-20" → "2026년 10월 20일 (화)"
export function formatReportDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${y}년 ${m}월 ${d}일 (${wd})`;
}

// "2026-10-21T13:34:28+09:00" → "2026.10.21 13:34 KST" (파이프라인이 KST로 기록)
export function formatPublished(generatedAt: string) {
  const [day, time = ""] = generatedAt.split("T");
  return `${day.replaceAll("-", ".")} ${time.slice(0, 5)} KST`;
}

function num(n: number, decimals: number) {
  return n.toLocaleString("ko-KR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function withUnit(text: string, unit: string) {
  return unit === "$" ? `$${text}` : `${text}${unit}`;
}

export function formatValue(i: Indicator) {
  return withUnit(num(i.value, i.decimals), i.unit);
}

export type Direction = "up" | "down" | "flat";

export function direction(change: number): Direction {
  return change > 0 ? "up" : change < 0 ? "down" : "flat";
}

// 색만으로 구분하지 않도록 항상 ▲/▼ 기호를 붙임
export function formatDelta(i: Indicator) {
  const dir = direction(i.change);
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "–";
  const sign = dir === "up" ? "+" : dir === "down" ? "-" : "";
  let text: string;
  if (i.unit === "%") text = `${num(Math.abs(i.change), i.decimals)}%p`;
  else if (i.change_pct !== null) text = `${Math.abs(i.change_pct).toFixed(2)}%`;
  else text = withUnit(num(Math.abs(i.change), i.decimals), i.unit);
  return `${arrow} ${sign}${text}`;
}

// 월별 경제지표는 관측일이 해당 월 1일 → "2026년 9월", 나머지는 "10/19 기준"
export function formatAsOf(i: Indicator) {
  const [y, m, d] = i.as_of.split("-");
  if (i.group === "경제지표" && d === "01") return `${y}년 ${Number(m)}월`;
  return `${Number(m)}/${Number(d)} 기준`;
}

// 등락 pill 색 (theme 토큰 up/down — globals.css)
export const PILL: Record<Direction, string> = {
  up: "bg-up-bg text-up border-up-border",
  down: "bg-down-bg text-down border-down-border",
  flat: "bg-surface-container text-on-surface-variant border-outline-variant",
};

export const DELTA_TEXT: Record<Direction, string> = {
  up: "text-up",
  down: "text-down",
  flat: "text-on-surface-variant",
};
