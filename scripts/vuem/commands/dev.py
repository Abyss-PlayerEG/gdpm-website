"""Dev command."""

from __future__ import annotations

import subprocess

import typer

from ..utils import PROJECT_DIR, console

app = typer.Typer(help="Start dev server")


@app.command()
def main() -> None:
    """Start dev server."""
    console.print("\n[bold]Starting dev server...[/bold]\n")
    subprocess.run(["pnpm", "run", "dev"], cwd=PROJECT_DIR)
