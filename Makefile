.PHONY: help dev test lint format run run-all clean

help:
	@echo "Available commands:"
	@echo "  make dev      - Install development dependencies"
	@echo "  make run      - Launch FastAPI dev server on port 8000"
	@echo "  make run-all  - Launch both FastAPI Backend (8000) and Vite Frontend (5173)"
	@echo "  make test     - Run pytest suite"
	@echo "  make lint     - Run ruff linter check"
	@echo "  make format   - Run ruff code formatting"
	@echo "  make clean    - Clean python bytecode and caches"

dev:
	pip install -e ".[dev]"

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

run-all:
	./start.sh

test:
	pytest tests/ -v

lint:
	ruff check .

format:
	ruff format .

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
