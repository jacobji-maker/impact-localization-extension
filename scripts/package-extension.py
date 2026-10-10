#!/usr/bin/env python3
"""Create a reproducible ZIP of the unpacked extension."""
from pathlib import Path
from io import BytesIO
import json
import zipfile


def main():
    root = Path(__file__).resolve().parents[1]
    source = root / "impact-cn-mod"
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    required = ["manifest.json"]
    if manifest.get("background", {}).get("service_worker"):
        required.append(manifest["background"]["service_worker"])
    for entry in manifest.get("content_scripts", []):
        required.extend(entry.get("js", []))
        required.extend(entry.get("css", []))
    action = manifest.get("action", {})
    if action.get("default_popup"):
        required.append(action["default_popup"])
    for file in required:
        if not (source / file).is_file():
            raise SystemExit(f"Missing required extension asset: {file}")
    out = root / "dist" / f"impact-cn-mod-{manifest['version']}.zip"
    payload = BytesIO()
    with zipfile.ZipFile(payload, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(source.rglob("*")):
            if file.is_file() and file.name != ".DS_Store":
                info = zipfile.ZipInfo(file.relative_to(source).as_posix(), (2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                archive.writestr(info, file.read_bytes())
    package_bytes = payload.getvalue()
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        with out.open("xb") as destination:
            destination.write(package_bytes)
    except FileExistsError:
        if out.read_bytes() != package_bytes:
            raise SystemExit(
                f"Refusing to overwrite an existing package: {out.name}. "
                "Update the extension version before packaging changed contents."
            )
    print(out)


if __name__ == "__main__":
    main()
