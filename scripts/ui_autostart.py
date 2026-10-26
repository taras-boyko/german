#!/usr/bin/env python3
"""Install or remove the macOS LaunchAgent for the DeutschDrill UI."""

from __future__ import annotations

import argparse
import os
import plistlib
import shutil
import subprocess
import sys
from pathlib import Path


LABEL = "com.deutschdrill.ui"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
AGENT_PATH = Path.home() / "Library" / "LaunchAgents" / f"{LABEL}.plist"
LOG_DIR = Path.home() / "Library" / "Logs" / "DeutschDrill"
DOMAIN = f"gui/{os.getuid()}"


def run_launchctl(*arguments: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    launchctl = shutil.which("launchctl")
    if launchctl is None:
        raise RuntimeError("launchctl is unavailable; this setup requires macOS.")

    result = subprocess.run(
        [launchctl, *arguments],
        capture_output=True,
        text=True,
        check=False,
    )
    if check and result.returncode:
        detail = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(detail or f"launchctl exited with status {result.returncode}.")
    return result


def job_target() -> str:
    return f"{DOMAIN}/{LABEL}"


def job_is_loaded() -> bool:
    return run_launchctl("print", job_target(), check=False).returncode == 0


def install() -> None:
    if sys.platform != "darwin":
        raise RuntimeError("The UI autostart configuration is for macOS only.")

    python = Path(sys.executable).resolve()
    if not python.is_file():
        raise RuntimeError(f"Could not find the Python executable: {python}")

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    AGENT_PATH.parent.mkdir(parents=True, exist_ok=True)
    configuration = {
        "Label": LABEL,
        "ProgramArguments": [
            str(python),
            str(PROJECT_ROOT / "server.py"),
            "--bind",
            "127.0.0.1",
            "--port",
            "4173",
        ],
        "WorkingDirectory": str(PROJECT_ROOT),
        "RunAtLoad": True,
        "StandardOutPath": str(LOG_DIR / "stdout.log"),
        "StandardErrorPath": str(LOG_DIR / "stderr.log"),
    }
    temporary_path = AGENT_PATH.with_suffix(".plist.tmp")
    try:
        temporary_path.write_bytes(plistlib.dumps(configuration))
        if job_is_loaded():
            run_launchctl("bootout", job_target())
        temporary_path.replace(AGENT_PATH)
        run_launchctl("bootstrap", DOMAIN, str(AGENT_PATH))
    finally:
        temporary_path.unlink(missing_ok=True)

    print(f"Autostart is enabled. The UI will be available at http://127.0.0.1:4173/")
    print(f"Logs: {LOG_DIR}")


def uninstall() -> None:
    if sys.platform != "darwin":
        raise RuntimeError("The UI autostart configuration is for macOS only.")

    if job_is_loaded():
        run_launchctl("bootout", job_target())
    if AGENT_PATH.exists():
        AGENT_PATH.unlink()
        print("Autostart is disabled and its LaunchAgent configuration was removed.")
    else:
        print("No LaunchAgent configuration was found; autostart is disabled.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("install", help="enable autostart for the current macOS user")
    commands.add_parser("uninstall", help="disable and remove the autostart configuration")
    arguments = parser.parse_args()

    try:
        if arguments.command == "install":
            install()
        else:
            uninstall()
    except (OSError, RuntimeError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
