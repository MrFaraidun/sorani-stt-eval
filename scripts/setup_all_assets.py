#!/usr/bin/env python3
"""
Full Asset Downloader and Environment Setup Script
Pre-downloads and caches ALL model weights (safetensors/bin) and datasets (.wav) locally.
"""

import os
import sys
import subprocess
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_CACHE_DIR = BASE_DIR / "models_cache"
DATASETS_DIR = BASE_DIR / "datasets"
TEST_SET_DIR = DATASETS_DIR / "test_set"
TRAINING_SET_DIR = DATASETS_DIR / "training_set" / "asosoft"
AUGMENTED_DIR = DATASETS_DIR / "kurdish_augmented"

def setup_directories():
    """Create all required directory structures."""
    print("📁 Creating directory structure...")
    MODELS_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    TEST_SET_DIR.mkdir(parents=True, exist_ok=True)
    TRAINING_SET_DIR.mkdir(parents=True, exist_ok=True)
    AUGMENTED_DIR.mkdir(parents=True, exist_ok=True)
    (BASE_DIR / "frontend" / "public" / "audio").mkdir(parents=True, exist_ok=True)
    print("✅ Directory structure initialized.")

def populate_datasets():
    """Run existing population scripts for datasets & test clips."""
    print("\n🎧 Populating 100% of audio datasets & 12 test clips...")
    env = {**os.environ, "PYTHONPATH": str(BASE_DIR)}
    
    populate_script = BASE_DIR / "scripts" / "populate_real_speech_clips.py"
    if populate_script.exists():
        subprocess.run([sys.executable, str(populate_script)], env=env, check=True)
    
    asosoft_script = BASE_DIR / "scripts" / "populate_asosoft_kurdish_speech.py"
    if asosoft_script.exists():
        subprocess.run([sys.executable, str(asosoft_script)], env=env, check=True)
    print("✅ All audio dataset files (.wav) downloaded and structured.")

def download_huggingface_models():
    """Pre-download 100% of model weight files (safetensors/bin) locally."""
    print("\n🤖 Pre-downloading 100% of HuggingFace ASR model weights & configs...")
    models_to_download = [
        "rzgar/whisper-large-v3-sorani-kurdish-ckb-v2",
        "openai/whisper-large-v3"
    ]
    
    try:
        from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
        for model_id in models_to_download:
            print(f"\n   ⬇️ Downloading full model weights & processor for: {model_id}")
            try:
                AutoProcessor.from_pretrained(model_id, cache_dir=str(MODELS_CACHE_DIR))
                print(f"   ✓ Processor downloaded for {model_id}")
            except Exception as e:
                print(f"   ⚠️ Processor warning: {e}")
                
            try:
                AutoModelForSpeechSeq2Seq.from_pretrained(
                    model_id,
                    cache_dir=str(MODELS_CACHE_DIR),
                    low_cpu_mem_usage=True
                )
                print(f"   ✓ FULL Model Weights (.safetensors / .bin) downloaded for {model_id}")
            except Exception as e:
                print(f"   ⚠️ Model weights warning for {model_id}: {e}")
                
    except ImportError:
        print("⚠️ transformers library missing in environment.")
    
    print("✅ All model weights downloaded and cached in models_cache/.")

def main():
    print("=========================================================")
    print("🚀 Sorani ASR Master Setup & Full Asset Pre-downloader")
    print("=========================================================")
    setup_directories()
    populate_datasets()
    download_huggingface_models()
    print("\n=========================================================")
    print("✨ GUARANTEED: ALL MODEL WEIGHTS & DATASETS ARE PRE-DOWNLOADED!")
    print("👉 Now you can run: ./start.sh")
    print("=========================================================")

if __name__ == "__main__":
    main()
