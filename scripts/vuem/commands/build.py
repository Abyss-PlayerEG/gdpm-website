"""Build command."""

from __future__ import annotations

import shutil
import time

import typer
from rich.panel import Panel

from ..utils import DIST_DIR, PROJECT_DIR, console, run_cmd

app = typer.Typer(help="Build for production")


@app.command()
def main() -> None:
    """Build for production."""
    console.print("\n[bold]Building...[/bold]\n")
    start = time.time()

    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
        console.print("  [dim]Cleaned dist/[/dim]")

    if not run_cmd(["pnpm", "run", "build"], "Building Vue app"):
        raise typer.Exit(1)

    elapsed = time.time() - start
    size = sum(f.stat().st_size for f in DIST_DIR.rglob("*") if f.is_file())

    console.print()
    console.print(
        Panel(
            f"[green]✓[/green] Build successful\n\n"
            f"  [dim]Time:[/dim]  {elapsed:.1f}s\n"
            f"  [dim]Size:[/dim]  {size / (1024 * 1024):.2f} MB\n"
            f"  [dim]Path:[/dim]  {DIST_DIR}",
            title="[bold green]Build Result[/bold green]",
            border_style="green",
            padding=(1, 2),
        )
    )
