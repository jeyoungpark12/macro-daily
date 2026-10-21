import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 HTML로 빌드 (web/out). GitHub Pages 등 아무 정적 호스팅에 올릴 수 있음.
  output: "export",
  // GitHub Pages는 https://<user>.github.io/<repo>/ 경로에서 서비스되므로 워크플로에서 주입
  basePath: process.env.NEXT_BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;
