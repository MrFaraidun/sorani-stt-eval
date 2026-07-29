#!/usr/bin/env bash
# ==============================================================================
# Sorani Kurdish ASR Master Setup Script
# Downloads all models, datasets, dependencies, and prepares the environment.
# ==============================================================================

set -e

echo "🚀 Setting up Python virtual environment and dependencies..."

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
export PYTHONPATH=.

pip install --quiet fastapi uvicorn reportlab numpy scipy requests python-dotenv pydantic transformers torch || true

echo ""
echo "📥 Running full asset and model downloader..."
python3 scripts/setup_all_assets.py

echo ""
echo "✨ SETUP COMPLETE! Now run: ./start.sh"
