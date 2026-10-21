from pathlib import Path
from zoneinfo import ZoneInfo

import yaml

ROOT_DIR = Path(__file__).resolve().parents[3]
CONFIG_DIR = ROOT_DIR / "pipeline" / "config"
REPORTS_DIR = ROOT_DIR / "data" / "reports"

KST = ZoneInfo("Asia/Seoul")


def load_sources() -> list[dict]:
    with open(CONFIG_DIR / "sources.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)["sources"]


def load_indicator_specs() -> list[dict]:
    with open(CONFIG_DIR / "indicators.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)["indicators"]


def load_categories() -> dict[str, list[str]]:
    with open(CONFIG_DIR / "keywords.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)["categories"]
