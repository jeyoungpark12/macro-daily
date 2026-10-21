import { notFound } from "next/navigation";
import ReportView from "@/components/ReportView";
import { getReport, getReportIndex } from "@/lib/reports";

export const dynamicParams = false;

export function generateStaticParams() {
  return getReportIndex().map((e) => ({ date: e.date }));
}

export default async function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const report = getReport(date);
  if (!report) notFound();
  return <ReportView report={report} />;
}
