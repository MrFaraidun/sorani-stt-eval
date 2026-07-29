#!/usr/bin/env bash
# ==============================================================================
# GreenSorani AI - Environment Setup & Installation Script
# Prepares Python virtualenv, backend dependencies, and frontend npm modules.
# ==============================================================================

set -e

echo "=== 🛠️ Setting up GreenSorani AI Suite ==="

# 1. Ensure Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install python3."
    exit 1
fi

# 2. Ensure Node.js and npm are available
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is required but not installed. Please install nodejs & npm."
    exit 1
fi

# 3. Create .env from .env.example if missing
if [ ! -f .env ]; then
  echo "📋 Creating .env configuration from .env.example..."
  cp .env.example .env
fi

# 4. Create Python Virtual Environment
if [ ! -d ".venv" ]; then
  echo "📦 Creating Python virtual environment (.venv)..."
  python3 -m venv .venv
else
  echo "✅ Python virtual environment (.venv) already exists."
fi

# 5. Upgrade pip & Install Python Dependencies
echo "📥 Installing backend Python dependencies..."
.venv/bin/python -m pip install --upgrade pip --quiet
if [ -f "requirements.txt" ]; then
  .venv/bin/pip install -r requirements.txt --quiet
fi

# 6. Install Frontend Node Modules
if [ -d "frontend" ]; then
  echo "🌐 Installing frontend npm packages..."
  cd frontend
  npm install --quiet
  cd ..
fi

echo "=============================================================================="
echo "✅ Setup Completed Successfully!"
echo "🚀 Next Step: Run './start.sh' to launch GreenSorani AI Suite on http://localhost:5173"
echo "=============================================================================="
