import fs from "node:fs";
import path from "node:path";

// pipeline/src/macro_daily/models.py 의 Report 와 같은 모양
// (?: 표시 필드는 나중에 추가된 것 — 예전 보고서에는 없을 수 있음)
export type SourceRef = { name: string; url: string };
export type ImpactTone = "positive" | "negative" | "neutral";
export type Impact = { label: string; tone: ImpactTone };
export type ReportItem = {
  title: string;
  summary: string;
  why_it_matters: string;
  sources: SourceRef[];
  impact?: Impact | null;
};
export type ReportSection = { category: string; items: ReportItem[] };
export type KeyPoint = { title: string; body: string };
export type Indicator = {
  name: string;
  group: string; // 시장 | 금리 | 경제지표
  value: number;
  change: number;
  change_pct: number | null;
  unit: string; // "" | "원" | "$" | "%"
  decimals: number;
  as_of: string;
  source_url: string;
  history?: number[];
};
export type Report = {
  date: string;
  generated_at: string;
  headline: string;
  sections: ReportSection[];
  article_count: number;
  lead?: string;
  key_points?: KeyPoint[];
  indicators?: Indicator[];
};
export type ReportIndexEntry = { date: string; headline: string };

// MACRO_REPORTS_DIR 로 다른 폴더를 지정할 수 있음 (테스트용)
const REPORTS_DIR = process.env.MACRO_REPORTS_DIR
  ? path.resolve(process.env.MACRO_REPORTS_DIR)
  : path.join(process.cwd(), "..", "data", "reports");

// 빌드 시점에 읽음 (정적 export)
export function getReportIndex(): ReportIndexEntry[] {
  const file = path.join(REPORTS_DIR, "index.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getReport(date: string): Report | null {
  const file = path.join(REPORTS_DIR, `${date}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getLatestReport(): Report | null {
  const [latest] = getReportIndex();
  return latest ? getReport(latest.date) : null;
}
