"""Preview command."""

from __future__ import annotations

import subprocess

import typer

from ..utils import DIST_DIR, PROJECT_DIR, console

app = typer.Typer(help="Preview built site")


@app.command()
def main() -> None:
    """Preview built site."""
    if not DIST_DIR.exists():
        console.print("[red]Error:[/red] No build found. Run 'vuem build' first.")
        raise typer.Exit(1)

    console.print("\n[bold]Previewing...[/bold]\n")
    subprocess.run(["pnpm", "run", "preview"], cwd=PROJECT_DIR)
