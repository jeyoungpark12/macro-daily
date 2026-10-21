# macro-daily

매일 아침 9시(KST), 전날의 거시경제 주요 기사를 수집·요약해 웹페이지로 보여주는 프로젝트.

## 구조

| 경로 | 역할 |
|---|---|
| `pipeline/` | 수집 → 필터 → 중복제거 → 분류 → Claude 요약 → JSON 저장 (Python) |
| `data/reports/` | 날짜별 보고서 JSON (`YYYY-MM-DD.json`) + `index.json` |
| `web/` | 보고서를 보여주는 Next.js 정적 사이트 |
| `.github/workflows/daily-report.yml` | 매일 09:00 KST 실행 → 커밋 → GitHub Pages 배포 |

## 로컬 실행

```bash
# 1) 파이프라인
cd pipeline
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp ../.env.example ../.env    # ANTHROPIC_API_KEY 입력
python -m macro_daily.main                  # 어제 날짜 보고서 생성
python -m macro_daily.main --date 2026-10-20 --dry-run   # LLM 호출 없이 수집만 확인

# 2) 웹
cd ../web
npm install
npm run dev     # http://localhost:3000
```

## 소스/키워드 추가

- 뉴스 소스: `pipeline/config/sources.yaml`
- 분류 키워드: `pipeline/config/keywords.yaml`

## 배포 (GitHub Pages)

1. 이 폴더를 독립 저장소로 push (GitHub Actions는 저장소 루트의 `.github/`만 인식)
2. Settings → Secrets → `ANTHROPIC_API_KEY` 등록
3. Settings → Pages → Source: **GitHub Actions**
