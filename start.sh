#!/usr/bin/env bash
# ==============================================================================
# GreenSorani AI - Unified Application Launcher Script
# Starts both FastAPI Backend (8000) & Vite React Frontend (5173)
# ==============================================================================

# Function to kill process on specific TCP ports
cleanup_port() {
  PORT=$1
  PIDS=$(lsof -t -i:$PORT 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "⚠️ Port $PORT occupied. Clearing PIDs: $PIDS..."
    kill -9 $PIDS 2>/dev/null || true
    sleep 0.5
  fi
}

echo "=== 🚀 Launching GreenSorani AI Suite ==="

# 1. Clear any stale processes holding ports 8000, 5173, 5174
cleanup_port 8000
cleanup_port 5173
cleanup_port 5174

# 2. Trap SIGINT and SIGTERM to clean up background backend process when user presses Ctrl+C
cleanup_all() {
  echo ""
  echo "=== 🛑 Shutting down GreenSorani AI Suite ==="
  if [ -n "$BACKEND_PID" ]; then
    kill -9 $BACKEND_PID 2>/dev/null || true
  fi
  cleanup_port 8000
  cleanup_port 5173
  exit 0
}
trap cleanup_all SIGINT SIGTERM INT TERM

# 3. Start FastAPI Backend in background without duplicate reload forks
echo "1. Starting FastAPI Backend Server on http://localhost:8000..."
PYTHONPATH=. .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait until backend is fully ready on /health probe
echo "Waiting for FastAPI Backend to be ready..."
MAX_RETRIES=20
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ FastAPI Backend is live on http://localhost:8000!"
    break
  fi
  sleep 0.5
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

# 4. Start Vite React Frontend Server in foreground
echo "2. Starting Vite React Frontend Server on http://localhost:5173..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173