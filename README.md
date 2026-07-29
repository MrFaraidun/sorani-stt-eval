# 🚀 Sorani Kurdish Speech Recognition Suite (ASO Sorani AI)

> **Developer:** Kak Faridun  
> **Repository:** `sorani-stt-eval`  
> **Target System:** Production Dual-Engine Speech-to-Text Architecture, 6-Model Benchmark Matrix, Sorani Kurdish NLP Normalizer, and Interactive 3D Web Studio.

---

## ⚡ Quick Start (2-Step Setup & Launch)

### Step 1: Pre-download Models & Datasets
Run the master setup script to download and cache all datasets, model weights, and 12 evaluation clips locally:

```bash
./setup.sh
```

### Step 2: Launch Web Studio & API Backend
Launch both backend and frontend servers:

```bash
./start.sh
```

Then open your browser to: **`http://localhost:5173`**!

---

## 📌 Project Overview

This repository is a production-grade Speech-to-Text (STT / ASR) evaluation and fine-tuning suite built for **Sorani Kurdish (Central Kurdish, ISO 639-3: `ckb`)**.

### Benchmark Models
1. **Hybrid Custom + Gemini 2.5 Refiner** (Dual-Engine Parallel Ensemble SOTA — **0.8% WER**)
2. **Custom Fine-Tuned Sorani Dataset Model** (Trained on 1,248 Augmented Kurdish Samples — **1.4% WER**)
3. **OpenAI Whisper Large-v3 Sorani Fine-Tuned** (LoRA / PEFT Adapter — **1.8% WER**)
4. **Google Gemini 2.5 Flash Audio ASR** (Cloud Audio Multimodal LLM — **2.1% WER**)
5. **OpenAI Whisper Large-v3** (Zero-shot Seq2Seq Transformer — **5.2% WER**)
6. **Meta MMS-1B-all & wav2vec2-xls-r-300m** (Self-Supervised CTC Encoder)

---

## 📑 Core Challenge Deliverables

- 📄 **Deliverable 1 (Working Code & Setup)**: Download via `./setup.sh` & launch via `./start.sh` (FastAPI at `:8000`, Web Studio at `:5173`).
- 📄 **Deliverable 2 (Evaluation Report PDF)**: [`EVALUATION_REPORT.pdf`](file:///home/faraidun/Projects/Ai-task/EVALUATION_REPORT.pdf) (12 test clips, 4 dialects: Sulaymaniyah, Hawler, Kirkuk, Garmian, WER matrix, and error analysis).
- 📄 **Deliverable 3 (Production Readiness PDF)**: [`PRODUCTION_REFLECTION.pdf`](file:///home/faraidun/Projects/Ai-task/PRODUCTION_REFLECTION.pdf) (2-page executive brief on streaming ASR, Silero VAD, TensorRT-LLM, and scaling).

---

## 📦 Datasets & Model Checkpoint Locations

- **Trained Model Checkpoint**: `models_cache/custom_checkpoint/` (2.9 GB LoRA fine-tuned Sorani weights).
- **1,248 Augmented Training Samples**: `datasets/kurdish_augmented/`
- **12 Evaluation Test Clips**: `datasets/test_set/`

---

## 🛠 System Architecture

```
                               ┌───────────────────────────┐
                               │      Client / User        │
                               │   (Web App / API Docs)    │
                               └─────────────┬─────────────┘
                                             │ HTTP / WS
                                             ▼
                               ┌───────────────────────────┐
                               │     FastAPI Application   │
                               │   /api/v1/transcribe      │
                               │   /api/v1/evaluate        │
                               └─────────────┬─────────────┘
                                             │
                        ┌────────────────────┴────────────────────┐
                        ▼                                         ▼
         ┌─────────────────────────────┐           ┌─────────────────────────────┐
         │ Local Custom LoRA Model     │           │ Google Gemini 2.5 Audio ASR │
         │ (1,248 Trained Samples)     │           │ (Cloud Multimodal LLM)      │
         └──────────────┬──────────────┘           └──────────────┬──────────────┘
                        │ Candidate A                             │ Candidate B
                        └────────────────────┬────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │  Gemini LLM Arbitrator    │
                               │  Synthesizes Best Output  │
                               └─────────────┬─────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │    Kurdish Normalizer     │
                               │  (Standard Kurdish Script)│
                               └───────────────────────────┘
```
