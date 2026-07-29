@echo off
REM ==============================================================================
REM GreenSorani AI - Windows Setup & Installation Script
REM ==============================================================================

echo === 🛠️ Setting up GreenSorani AI Suite on Windows ===

IF NOT EXIST .env (
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
)

IF NOT EXIST .venv (
    echo 📦 Creating Python virtual environment (.venv)...
    python -m venv .venv
)

echo 📥 Installing backend Python dependencies...
.venv\Scripts\python.exe -m pip install --upgrade pip --quiet
.venv\Scripts\pip.exe install -r requirements.txt --quiet

IF EXIST frontend (
    echo 🌐 Installing frontend npm packages...
    cd frontend
    call npm install --quiet
    cd ..
)

echo ==============================================================================
echo ✅ Setup Completed Successfully!
echo 🚀 Next Step: Run 'start.bat' to launch GreenSorani AI Suite on http://localhost:5173
echo ==============================================================================
