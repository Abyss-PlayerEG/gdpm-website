"""Generate command."""

from __future__ import annotations

from pathlib import Path

import typer

from ..utils import PROJECT_DIR, console

app = typer.Typer(help="Generate component/page/composable")

SRC_DIR = PROJECT_DIR / "src"

COMPONENT_TEMPLATE = '''<template>
  <div class="{name_kebab}">
    {name}
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.{name_kebab} {
  /* styles */
}
</style>
'''

PAGE_TEMPLATE = '''<template>
  <section class="{name_kebab}-page">
    <h1>{name}</h1>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.{name_kebab}-page {
  min-height: 100vh;
  padding: 80px 2rem;
}
</style>
'''

COMPOSABLE_TEMPLATE = '''import { ref } from 'vue'

export function use{Name}() {
  // composable logic

  return {}
}
'''


def to_kebab(name: str) -> str:
    """Convert PascalCase to kebab-case."""
    result = []
    for i, c in enumerate(name):
        if c.isupper() and i > 0:
            result.append("-")
        result.append(c.lower())
    return "".join(result)


@app.command()
def component(name: str) -> None:
    """Generate a Vue component."""
    path = SRC_DIR / "components" / f"{name}.vue"
    if path.exists():
        console.print(f"[red]Error:[/red] {path} already exists")
        raise typer.Exit(1)

    content = COMPONENT_TEMPLATE.replace("{name_kebab}", to_kebab(name)).replace("{name}", name)
    path.write_text(content)
    console.print(f"[green]✓[/green] Created {path.relative_to(PROJECT_DIR)}")


@app.command()
def page(name: str) -> None:
    """Generate a Vue page."""
    path = SRC_DIR / "views" / f"{name}.vue"
    if path.exists():
        console.print(f"[red]Error:[/red] {path} already exists")
        raise typer.Exit(1)

    content = PAGE_TEMPLATE.replace("{name_kebab}", to_kebab(name)).replace("{name}", name)
    path.write_text(content)
    console.print(f"[green]✓[/green] Created {path.relative_to(PROJECT_DIR)}")


@app.command()
def composable(name: str) -> None:
    """Generate a Vue composable."""
    clean_name = name[3:] if name.startswith("use") else name
    func_name = f"use{clean_name}"

    path = SRC_DIR / "composables" / f"{func_name}.ts"
    if path.exists():
        console.print(f"[red]Error:[/red] {path} already exists")
        raise typer.Exit(1)

    content = COMPOSABLE_TEMPLATE.replace("{Name}", clean_name)
    path.write_text(content)
    console.print(f"[green]✓[/green] Created {path.relative_to(PROJECT_DIR)}")
