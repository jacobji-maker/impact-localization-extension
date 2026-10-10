#!/usr/bin/env python3
"""Synthetic packager checks; all packages are built in isolated temporary roots."""
from argparse import ArgumentParser
from hashlib import sha256
from pathlib import Path
from shutil import copy2, copytree
from tempfile import TemporaryDirectory, mkdtemp
import json
import os
import subprocess
import sys
import zipfile


root = Path(__file__).resolve().parents[1]
parser = ArgumentParser(description=__doc__)
parser.add_argument("--report-dir", type=Path)
options = parser.parse_args()
report_dir = options.report_dir or Path(mkdtemp(prefix="impact-package-report-"))
report_dir.mkdir(parents=True, exist_ok=True)
report_file = report_dir / "package-regression-report.json"
if report_file.exists():
    raise SystemExit("Refusing to overwrite a package regression report; choose a new directory")
results = []


def check(name, action):
    try:
        action()
        results.append({"name": name, "status": "PASS"})
    except Exception as error:
        results.append({"name": name, "status": "FAIL", "errorType": type(error).__name__})
    print(f"PACKAGE {results[-1]['status']} {name}")


with TemporaryDirectory(prefix="impact-package-regression-") as folder:
    fixture = Path(folder)
    (fixture / "scripts").mkdir()
    copy2(root / "scripts/package-extension.py", fixture / "scripts/package-extension.py")
    copytree(root / "impact-cn-mod", fixture / "impact-cn-mod", ignore=lambda directory, names: [name for name in names if name == ".DS_Store"])
    source = fixture / "impact-cn-mod"
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    package = fixture / "dist" / f"impact-cn-mod-{manifest['version']}.zip"

    def build():
        return subprocess.run([sys.executable, "scripts/package-extension.py"], cwd=fixture, capture_output=True, text=True, check=False)

    def fresh_package():
        assert not package.exists()
        assert build().returncode == 0
        expected = {file.relative_to(source).as_posix(): file.read_bytes() for file in source.rglob("*") if file.is_file()}
        assert len(expected) == 12
        with zipfile.ZipFile(package) as archive:
            assert archive.testzip() is None
            assert len(archive.namelist()) == len(expected)
            assert set(archive.namelist()) == set(expected)
            assert "manifest.json" in archive.namelist()
            for name, contents in expected.items():
                assert archive.read(name) == contents
            assert all(info.date_time == (2026, 1, 1, 0, 0, 0) for info in archive.infolist())
            assert all(info.compress_type == zipfile.ZIP_DEFLATED for info in archive.infolist())

    def identical_package():
        before = package.read_bytes()
        # A deliberately old mtime makes an accidental rewrite observable without sleeping.
        os.utime(package, ns=(1_600_000_000_000_000_000, 1_600_000_000_000_000_000))
        before_mtime = package.stat().st_mtime_ns
        assert build().returncode == 0
        assert package.read_bytes() == before
        assert package.stat().st_mtime_ns == before_mtime

    def different_package():
        before = package.read_bytes()
        before_mtime = package.stat().st_mtime_ns
        file = source / "content.js"
        file.write_bytes(file.read_bytes() + b"\n// Synthetic changed content for version collision check.\n")
        result = build()
        assert result.returncode != 0
        assert "Update the extension version" in result.stderr
        assert package.read_bytes() == before
        assert package.stat().st_mtime_ns == before_mtime

    check("New ZIP has root manifest, twelve source-identical files and valid CRC", fresh_package)
    check("Identical same-version package is reused without changing mtime", identical_package)
    check("Different same-version package is rejected and original ZIP retained", different_package)
    package_digest = sha256(package.read_bytes()).hexdigest() if package.exists() else None

status = "PASS" if all(item["status"] == "PASS" for item in results) else "FAIL"
report = {"mode": "SYNTHETIC_ISOLATED_PACKAGE_ONLY", "status": status, "version": manifest["version"], "realSiteAcceptance": False, "realNetworkQueries": False, "originalDistAccessed": False, "packageSHA256": package_digest, "results": results}
with report_file.open("x", encoding="utf-8") as destination:
    json.dump(report, destination, ensure_ascii=False, indent=2)
    destination.write("\n")
print(f"PACKAGE {status}: {sum(item['status'] == 'PASS' for item in results)}/{len(results)}; report: {report_file}")
raise SystemExit(0 if status == "PASS" else 1)
