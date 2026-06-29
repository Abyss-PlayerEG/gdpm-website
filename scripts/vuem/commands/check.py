"""Check command."""

from __future__ import annotations

import typer

from ..utils import console, run_cmd

app = typer.Typer(help="Run lint + typecheck")


@app.command()
def main() -> None:
    """Run all checks."""
    console.print("\n[bold]Checking...[/bold]\n")

    ok = True
    if not run_cmd(["pnpm", "run", "lint"], "Linting"):
        ok = False
    if not run_cmd(["pnpm", "run", "typecheck"], "Type checking"):
        ok = False

    console.print()
    if ok:
        console.print("[green]✓[/green] All checks passed")
    else:
        console.print("[red]✗[/red] Some checks failed")
        raise typer.Exit(1)
