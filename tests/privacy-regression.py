#!/usr/bin/env python3
"""Identifier redaction checks; preserve failure evidence and official links."""
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
spec = spec_from_file_location("impact_audit_redaction", root / "scripts/sanitize-live-artifacts.py")
module = module_from_spec(spec)
spec.loader.exec_module(module)

results = []


def check(name, action):
    try:
        action()
        results.append({"name": name, "status": "PASS"})
    except AssertionError:
        results.append({"name": name, "status": "FAIL"})


def welcome_fields():
    data = module.redact({"source": "Welcome Back, Synthetic Guest", "target": "欢迎回来，Synthetic Guest"})
    assert data == {"source": "Welcome Back, <display-name>", "target": "欢迎回来，<display-name>"}


def error_evidence():
    message = "Welcome Back, authentication failed; 4 login attempts left"
    data = module.redact({"evidence": message, "status": "FAIL", "errors": ["4 login attempts left"]})
    assert data == {"evidence": message, "status": "FAIL", "errors": ["4 login attempts left"]}


def identifiers_and_urls():
    data = module.redact({"text": "Contact synthetic.person@example.test", "links": [{"href": "https://help.impact.com/brand/actions"}], "numeric": "$123,456.78", "results": [{"evidence": "Auth failed for synthetic.person@example.test; phase=password; attempts=4"}]})
    assert data["text"] == "Contact <email>"
    assert data["results"][0]["evidence"] == "Auth failed for <email>; phase=password; attempts=4"
    assert data["links"][0]["href"] == "https://help.impact.com/brand/actions"
    assert data["numeric"] == "$123,456.78"


def idempotence():
    data = {"text": "Welcome Back, Synthetic Guest", "evidence": "FAIL four attempts left", "emails": ["synthetic.person@example.test"]}
    once = module.redact(data)
    assert module.redact(once) == once


check("Welcome name suffix redacted only in audit text fields", welcome_fields)
check("Failure status, login warning and attempt counter preserved", error_evidence)
check("Email identifiers redacted while error context, values and official URLs remain", identifiers_and_urls)
check("Repeated redaction is idempotent", idempotence)
status = "FAIL" if any(result["status"] == "FAIL" for result in results) else "PASS"
(root / "artifacts").mkdir(exist_ok=True)
(root / "artifacts/privacy-unit-report.json").write_text(json.dumps({"mode": "PRIVACY_UNIT_ONLY", "status": status, "results": results}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"PRIVACY UNIT {status}: {sum(result['status'] == 'PASS' for result in results)}/{len(results)}")
raise SystemExit(0 if status == "PASS" else 1)
