@echo off
REM GDPM Website - Windows Project Init

echo === GDPM Website Init ===
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js not found. Install from https://nodejs.org
    exit /b 1
)

REM Check pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing pnpm...
    npm install -g pnpm
)

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python not found. Install from https://python.org
    exit /b 1
)

REM Check uv
where uv >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing uv...
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
)

echo Installing Node.js dependencies...
call pnpm install

echo Installing Python dependencies...
call uv sync

echo.
echo === Done! ===
echo.
echo Run: uv run vuem dev
