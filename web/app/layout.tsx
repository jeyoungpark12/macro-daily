import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "모닝 매크로 브리핑",
  description: "매일 아침, 전날의 거시경제 주요 뉴스와 시장 지표 브리핑",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap";
const ICONS = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <link rel="stylesheet" href={ICONS} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
