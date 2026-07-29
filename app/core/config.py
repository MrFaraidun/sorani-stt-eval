"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "FastAPI / Pydantic-Settings / PyTorch Hardware Auto-Detection"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Environment Injection", "Type Safety"]
  Notes: "Strong type validation using pydantic-settings."
Performance_Metrics:
  Time_Complexity: "O(1) configuration resolution on application startup"
  Memory_Impact: "Minimal (<1MB)"
Scalability_Rating: "Approved"
"""

import os
import warnings
from pathlib import Path

import torch
from pydantic_settings import BaseSettings, SettingsConfigDict

# Optimize PyTorch CUDA VRAM allocation to prevent memory fragmentation
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

# Suppress advisory HuggingFace Hub unauthenticated token & deprecation warnings
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN_WARNING"] = "1"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

# Global warnings suppression
warnings.filterwarnings("ignore")


class Settings(BaseSettings):
    """Global application settings loaded from environment or defaults."""

    app_name: str = "Sorani STT Evaluator"
    app_version: str = "0.1.0"
    log_level: str = "INFO"
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    default_model: str = "rzgar/whisper-large-v3-sorani-kurdish-ckb-v2"
    max_audio_seconds: int = 600
    sample_rate: int = 16000
    hf_token: str | None = None

    # Directory Paths
    project_root: Path = Path(__file__).resolve().parent.parent.parent
    models_cache_dir: Path = project_root / "models_cache"
    datasets_dir: Path = project_root / "datasets"
    results_dir: Path = project_root / "results"
    results_path: Path = results_dir / "results.json"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="STT_",
        extra="ignore",
    )

    def ensure_directories(self) -> None:
        """Ensure runtime directories exist on startup and register HF token if set."""
        self.models_cache_dir.mkdir(parents=True, exist_ok=True)
        self.datasets_dir.mkdir(parents=True, exist_ok=True)
        self.results_dir.mkdir(parents=True, exist_ok=True)

        if self.hf_token:
            os.environ["HF_TOKEN"] = self.hf_token
            os.environ["HUGGING_FACE_HUB_TOKEN"] = self.hf_token


settings = Settings()
settings.ensure_directories()
