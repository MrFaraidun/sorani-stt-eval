#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# ASO Voice Commander — Launch OpenInterpreter with Hermes 3 (NVIDIA NIM)
# ═══════════════════════════════════════════════════════════════════════
# Usage:  ./start_agent.sh
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

# Load .env file for NVIDIA_API_KEY
if [ -f "$(dirname "$0")/.env" ]; then
  set -a
  source "$(dirname "$0")/.env"
  set +a
fi

if [ -z "${NVIDIA_API_KEY:-}" ]; then
  echo "❌ NVIDIA_API_KEY not found in .env — cannot start agent."
  exit 1
fi

echo "═══════════════════════════════════════════════════════"
echo "  🎙️  ASO Voice Commander — OpenInterpreter + Hermes 3"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Model:  nvidia/llama-3.1-nemotron-70b-instruct"
echo "  API:    NVIDIA NIM (integrate.api.nvidia.com)"
echo "  Lang:   Sorani Kurdish / English"
echo ""
echo "  Type your command or speak in Kurdish!"
echo "  Type 'exit' or Ctrl+C to quit."
echo "═══════════════════════════════════════════════════════"
echo ""

# Launch OpenInterpreter with NVIDIA NIM + Hermes/Llama
PYTHONPATH=. .venv/bin/interpreter \
  --api_base "https://integrate.api.nvidia.com/v1" \
  --api_key "$NVIDIA_API_KEY" \
  --model "openai/meta/llama-3.1-70b-instruct" \
  --context_window 8000 \
  --auto_run
