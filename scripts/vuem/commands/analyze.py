"""Analyze command."""

from __future__ import annotations

from pathlib import Path

import typer
from rich.table import Table

from ..utils import DIST_DIR, console, format_size

app = typer.Typer(help="Analyze bundle size")


@app.command()
def main() -> None:
    """Analyze bundle size."""
    if not DIST_DIR.exists():
        console.print("[red]Error:[/red] No build found. Run 'vuem build' first.")
        raise typer.Exit(1)

    console.print("\n[bold]Bundle Analysis[/bold]\n")

    files = []
    for f in DIST_DIR.rglob("*"):
        if f.is_file():
            rel = f.relative_to(DIST_DIR)
            size = f.stat().st_size
            files.append((str(rel), size))

    files.sort(key=lambda x: x[1], reverse=True)

    table = Table(show_header=True, header_style="bold")
    table.add_column("File", style="cyan")
    table.add_column("Size", justify="right")
    table.add_column("Type")

    total = 0
    for name, size in files[:20]:
        ext = Path(name).suffix or "other"
        table.add_row(name, format_size(size), ext)
        total += size

    console.print(table)
    console.print(f"\n  Total: [bold]{format_size(total)}[/bold] ({len(files)} files)\n")

    by_type: dict[str, int] = {}
    for name, size in files:
        ext = Path(name).suffix or "other"
        by_type[ext] = by_type.get(ext, 0) + size

    console.print("[bold]By type:[/bold]")
    for ext, size in sorted(by_type.items(), key=lambda x: x[1], reverse=True):
        pct = size / total * 100 if total > 0 else 0
        console.print(f"  {ext:10s} {format_size(size):>10s}  ({pct:.1f}%)")
