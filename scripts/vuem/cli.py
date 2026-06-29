"""Vue Project Manager - Main CLI."""

from __future__ import annotations

import sys
from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from . import __version__
from .commands import analyze, build, check, clean, dev, generate, preview, version

app = typer.Typer(
    name="vuem",
    help="Vue Project Manager - Build, dev, clean, analyze, generate",
    invoke_without_command=True,
)
console = Console()

COMMANDS = {
    "1": ("build", "Build for production", build.main),
    "2": ("dev", "Start dev server", dev.main),
    "3": ("clean", "Clean build artifacts", clean.main),
    "4": ("preview", "Preview built site", preview.main),
    "5": ("check", "Run lint + typecheck", check.main),
    "6": ("analyze", "Analyze bundle size", analyze.main),
    "7": ("version", "Show version", version.show),
    "q": ("quit", "Exit", None),
}

# Register subcommands
app.command(name="build")(build.main)
app.command(name="dev")(dev.main)
app.command(name="clean")(clean.main)
app.command(name="preview")(preview.main)
app.command(name="check")(check.main)
app.command(name="analyze")(analyze.main)
app.add_typer(version.app, name="version")
app.add_typer(generate.app, name="generate")


def show_menu() -> None:
    """Show interactive menu."""
    console.print()
    console.print(
        Panel(
            f"[bold white]Vue Project Manager[/bold white] [dim]v{__version__}[/dim]",
            border_style="blue",
            padding=(0, 2),
        )
    )
    console.print()

    groups = [
        ("Development", [
            ("1", "build", "Build for production"),
            ("2", "dev", "Start dev server"),
            ("3", "clean", "Clean build artifacts"),
            ("4", "preview", "Preview built site"),
        ]),
        ("Quality", [
            ("5", "check", "Run lint + typecheck"),
            ("6", "analyze", "Analyze bundle size"),
        ]),
        ("Tools", [
            ("7", "version", "Show version"),
        ]),
    ]

    for group_name, items in groups:
        console.print(f"  [bold dim]{group_name}[/bold dim]")
        for key, _, desc in items:
            console.print(f"    [cyan]{key}[/cyan]  {desc}")
        console.print()

    console.print("  [dim]q  Exit[/dim]")
    console.print()


@app.callback()
def main(ctx: typer.Context) -> None:
    """Vue Project Manager."""
    if ctx.invoked_subcommand is None:
        while True:
            show_menu()
            choice = Prompt.ask("Select", choices=list(COMMANDS.keys()))
            name, desc, func = COMMANDS[choice]

            if name == "quit":
                console.print("[dim]Bye[/dim]")
                break

            # Run command
            console.print()
            try:
                func()
            except Exception as e:
                console.print(f"[red]Error:[/red] {e}")

            # Wait for user to continue
            console.print()
            Prompt.ask("[dim]Press Enter to continue...[/dim]", default="")

            # Clear screen
            import os
            os.system("cls" if os.name == "nt" else "clear")


if __name__ == "__main__":
    app()
