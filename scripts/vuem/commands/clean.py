"""Clean command."""

from __future__ import annotations

import shutil

import typer

from ..utils import DIST_DIR, PROJECT_DIR, console

app = typer.Typer(help="Clean build artifacts")


@app.command()
def main() -> None:
    """Clean build artifacts."""
    console.print("\n[bold]Cleaning...[/bold]\n")
    removed = 0

    for name in ["dist", "node_modules/.vite"]:
        path = PROJECT_DIR / name
        if path.exists():
            shutil.rmtree(path)
            console.print(f"  [dim]Removed {name}/[/dim]")
            removed += 1

    if removed == 0:
        console.print("  [dim]Nothing to clean[/dim]")
    else:
        console.print(f"\n  [green]✓[/green] Cleaned {removed} items")
