@echo off
REM ==============================================================================
REM GreenSorani AI - Windows Application Launcher Script
REM ==============================================================================

echo === 🚀 Launching GreenSorani AI Suite on Windows ===

IF NOT EXIST .venv (
    echo ⚠️ Dependencies missing. Running setup.bat first...
    call setup.bat
)

IF NOT EXIST .env (
    copy .env.example .env
)

echo 1. Starting FastAPI Backend Server on http://localhost:8000...
start /b cmd /c "set PYTHONPATH=. && .venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000"

echo 2. Starting Vite React Frontend Server on http://localhost:5173...
cd frontend
call npm run dev -- --host 0.0.0.0 --port 5173
