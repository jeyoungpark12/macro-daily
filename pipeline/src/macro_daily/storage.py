import json
from dataclasses import asdict
from pathlib import Path

from .config import REPORTS_DIR
from .models import Report


def save_report(report: Report, reports_dir: Path = REPORTS_DIR) -> Path:
    reports_dir.mkdir(parents=True, exist_ok=True)
    path = reports_dir / f"{report.date}.json"
    path.write_text(json.dumps(asdict(report), ensure_ascii=False, indent=2), encoding="utf-8")
    _update_index(report, reports_dir)
    return path


def _update_index(report: Report, reports_dir: Path) -> None:
    index_path = reports_dir / "index.json"
    entries = json.loads(index_path.read_text(encoding="utf-8")) if index_path.exists() else []
    entries = [e for e in entries if e["date"] != report.date]
    entries.append({"date": report.date, "headline": report.headline})
    entries.sort(key=lambda e: e["date"], reverse=True)
    index_path.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
