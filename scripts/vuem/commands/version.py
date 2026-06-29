"""Version command."""

from __future__ import annotations

import json
import re

import typer
from rich.panel import Panel

from ..utils import PROJECT_DIR, console

app = typer.Typer(help="Show/update version")

PACKAGE_JSON = PROJECT_DIR / "package.json"
PYPROJECT_TOML = PROJECT_DIR / "pyproject.toml"


def read_current() -> str:
    """Read current version."""
    data = json.loads(PACKAGE_JSON.read_text())
    return data.get("version", "0.0.0")


def update_files(version: str) -> None:
    """Update version in all files."""
    # package.json
    data = json.loads(PACKAGE_JSON.read_text())
    data["version"] = version
    PACKAGE_JSON.write_text(json.dumps(data, indent=2) + "\n")

    # pyproject.toml
    content = PYPROJECT_TOML.read_text()
    content = re.sub(
        r'^version\s*=\s*"[^"]*"',
        f'version = "{version}"',
        content,
        flags=re.MULTILINE,
    )
    PYPROJECT_TOML.write_text(content)


@app.command()
def show() -> None:
    """Show current version."""
    version = read_current()
    console.print()
    console.print(
        Panel(
            f"  [dim]Current version:[/dim]  [cyan]{version}[/cyan]",
            title="[bold]Version[/bold]",
            border_style="blue",
            padding=(1, 2),
        )
    )


@app.command()
def set(version: str) -> None:
    """Set version."""
    current = read_current()
    update_files(version)
    console.print()
    console.print(
        Panel(
            f"  [dim]Updated:[/dim]  [cyan]{current}[/cyan] → [green]{version}[/green]",
            title="[bold green]Version Updated[/bold green]",
            border_style="green",
            padding=(1, 2),
        )
    )


@app.command()
def bump(part: str = typer.Argument(..., help="major, minor, patch")) -> None:
    """Bump version."""
    current = read_current()
    major, minor, patch = current.split(".")[:3]
    patch = patch.split("-")[0]

    if part == "major":
        major = str(int(major) + 1)
        minor, patch = "0", "0"
    elif part == "minor":
        minor = str(int(minor) + 1)
        patch = "0"
    elif part == "patch":
        patch = str(int(patch) + 1)
    else:
        console.print(f"[red]Error:[/red] Unknown part '{part}'")
        raise typer.Exit(1)

    new_version = f"{major}.{minor}.{patch}"
    update_files(new_version)
    console.print()
    console.print(
        Panel(
            f"  [dim]Bumped:[/dim]  [cyan]{current}[/cyan] → [green]{new_version}[/green]",
            title="[bold green]Version Bumped[/bold green]",
            border_style="green",
            padding=(1, 2),
        )
    )
