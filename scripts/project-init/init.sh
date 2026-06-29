#!/bin/bash
# GDPM Website - macOS/Linux Project Init

set -e

echo "=== GDPM Website Init ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 not found. Install from https://python.org"
    exit 1
fi

# Check uv
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

echo "Installing Node.js dependencies..."
pnpm install

echo "Installing Python dependencies..."
uv sync

echo ""
echo "=== Done! ==="
echo ""
echo "Run: uv run vuem dev"
