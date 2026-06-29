"""Shared utilities for vuem commands."""

from __future__ import annotations

import subprocess
from pathlib import Path

from rich.console import Console

console = Console()
PROJECT_DIR = Path(__file__).parent.parent.parent
DIST_DIR = PROJECT_DIR / "dist"


def run_cmd(cmd: list[str], label: str) -> bool:
    """Run a command with status output."""
    console.print(f"  [dim]{label}...[/dim]")
    result = subprocess.run(cmd, cwd=PROJECT_DIR, capture_output=True, text=True)
    if result.returncode != 0:
        console.print(f"  [red]✗[/red] {label} failed")
        console.print(f"    {result.stderr.strip()}")
        return False
    return True


def format_size(size: int) -> str:
    """Format size to human readable."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.2f} MB"
