#!/usr/bin/env python3
"""Redact welcome-name suffixes and email addresses in live audit JSON."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
directory = root / "artifacts" / "live"
welcome = re.compile(r"^(\s*(?:Welcome\s+Back\s*,|欢迎回来[，,])\s*)(.+)$", re.IGNORECASE)
email = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")


def redact(value, key=None):
    if isinstance(value, str):
        match = welcome.match(value) if key in {"text", "source", "target", "original", "translated"} else None
        if match:
            value = match.group(1) + "<display-name>"
        return email.sub("<email>", value)
    if isinstance(value, list):
        return [redact(item, key) for item in value]
    if isinstance(value, dict):
        return {child_key: redact(item, child_key) for child_key, item in value.items()}
    return value


def main():
    for file in sorted(directory.glob("*.json")):
        data = json.loads(file.read_text(encoding="utf-8"))
        sanitized = redact(data)
        if data != sanitized:
            file.write_text(json.dumps(sanitized, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Redacted audit identifiers: {file.name}")


if __name__ == "__main__":
    main()
