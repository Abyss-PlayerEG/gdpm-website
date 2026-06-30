#!/usr/bin/env python3
"""Convert fonts to WOFF2 format."""

from __future__ import annotations

import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from fontTools.ttLib import TTFont
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()
FONTS_DIR = Path(__file__).parent.parent.parent / "src" / "assets" / "fonts"
ORIGINAL_DIR = FONTS_DIR / "original"
WOFF2_DIR = FONTS_DIR / "woff2"


def format_size(size: int) -> str:
    """Format size to human readable."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.0f} KB"
    else:
        return f"{size / (1024 * 1024):.1f} MB"


def convert_one(font_file: Path) -> dict:
    """Convert a single font file to WOFF2."""
    woff2_path = WOFF2_DIR / font_file.with_suffix(".woff2").name
    original_size = font_file.stat().st_size

    font = TTFont(font_file)
    font.flavor = "woff2"
    font.save(woff2_path)
    font.close()

    new_size = woff2_path.stat().st_size
    return {
        "name": font_file.name,
        "original": original_size,
        "converted": new_size,
        "ratio": (1 - new_size / original_size) * 100,
    }


def main() -> None:
    """Convert all TTF/OTF fonts to WOFF2."""
    if not ORIGINAL_DIR.exists():
        console.print(f"[red]Error:[/red] Original directory not found: {ORIGINAL_DIR}")
        sys.exit(1)

    WOFF2_DIR.mkdir(parents=True, exist_ok=True)

    # Collect fonts
    fonts = [f for f in ORIGINAL_DIR.glob("*") if f.suffix.lower() in (".ttf", ".otf")]

    if not fonts:
        console.print("\n  [dim]No fonts found to convert[/dim]\n")
        return

    # Filter already converted
    to_convert = []
    skipped = 0
    for f in fonts:
        woff2_path = WOFF2_DIR / f.with_suffix(".woff2").name
        if woff2_path.exists():
            console.print(f"  [dim]⏭ {f.name} — already converted[/dim]")
            skipped += 1
        else:
            to_convert.append(f)

    if not to_convert:
        console.print(f"\n  [dim]All {skipped} fonts already converted[/dim]\n")
        return

    workers = min(len(to_convert), os.cpu_count() or 2)
    console.print(f"\n[bold]Converting fonts to WOFF2[/bold] [dim]({workers} workers)[/dim]\n")
    console.print("  [dim]Compressing...[/dim]")

    results = []
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(convert_one, f): f for f in to_convert}

        for future in as_completed(futures):
            font_file = futures[future]
            try:
                result = future.result()
                results.append(result)
                console.print(f"  [green]✓[/green] {result['name']}")
                console.print(
                    f"    {format_size(result['original'])} → "
                    f"{format_size(result['converted'])} "
                    f"({result['ratio']:.1f}% smaller)"
                )
            except Exception as e:
                console.print(f"  [red]✗[/red] {font_file.name}: {e}")

    # Show results
    if results:
        table = Table(show_header=True, header_style="bold", box=None)
        table.add_column("Font", style="cyan")
        table.add_column("Original", justify="right")
        table.add_column("WOFF2", justify="right")
        table.add_column("Saved", justify="right", style="green")

        for r in results:
            table.add_row(
                r["name"],
                format_size(r["original"]),
                format_size(r["converted"]),
                f"{r['ratio']:.1f}%",
            )

        console.print()
        console.print(table)

        total_original = sum(r["original"] for r in results)
        total_converted = sum(r["converted"] for r in results)
        total_ratio = (1 - total_converted / total_original) * 100

        console.print()
        console.print(
            Panel(
                f"  [green]✓[/green] Converted {len(results)} fonts\n"
                f"  [dim]Skipped:[/dim]    {skipped}\n"
                f"  [dim]Original:[/dim]   {format_size(total_original)}\n"
                f"  [dim]Converted:[/dim]  {format_size(total_converted)}\n"
                f"  [dim]Saved:[/dim]      {total_ratio:.1f}%",
                title="[bold]Result[/bold]",
                border_style="green",
                width=50,
            )
        )


if __name__ == "__main__":
    main()
