"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "FastAPI Router / Multi-Model Comparison Endpoint"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Temporary File Cleanup"]
  Notes: "Executes 5 ASR models on identical preprocessed audio stream."
Performance_Metrics:
  Time_Complexity: "O(Models * Inference)"
  Memory_Impact: "Cached singleton model registry"
Scalability_Rating: "Approved"
"""

import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel

from app.schemas.transcribe import TranscriptionResult
from app.services.audio_pipeline import audio_pipeline
from app.services.evaluator import EvaluationMetrics, evaluator_service
from app.services.model_registry import model_registry

router = APIRouter()


class ModelComparisonItem(BaseModel):
    model_key: str
    model_name: str
    transcription: TranscriptionResult
    metrics: EvaluationMetrics


class ModelComparisonResponse(BaseModel):
    audio_duration_sec: float
    reference_text: str
    comparisons: list[ModelComparisonItem]


@router.post(
    "/compare",
    response_model=ModelComparisonResponse,
    summary="Compare All 5 Models on Single Audio Clip",
    tags=["Evaluation"],
)
async def compare_all_models(
    file: UploadFile = File(...),
    reference_text: str = Form(...),
):
    """
    Run Whisper zero-shot, Whisper FT, wav2vec2, MMS, and NeMo on an uploaded audio file.
    """
    suffix = Path(file.filename or "clip.wav").suffix
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        processed_wave, _sr = await run_in_threadpool(audio_pipeline.load_and_preprocess, tmp_path)
        wav_path = f"{tmp_path}_16k.wav"
        audio_pipeline.save_processed(processed_wave, wav_path)

        duration_sec = float(processed_wave.shape[1] / 16000.0)

        target_models = ["whisper-v3", "whisper-ft", "wav2vec2", "mms", "nemo"]
        comparisons = []

        for key in target_models:
            service = model_registry.get_model(key)
            tx = await run_in_threadpool(service.transcribe, wav_path, "ckb", True)
            metrics = evaluator_service.evaluate(reference_text, tx.text)
            comparisons.append(
                ModelComparisonItem(
                    model_key=key,
                    model_name=service.model_name,
                    transcription=tx,
                    metrics=metrics,
                )
            )

        return ModelComparisonResponse(
            audio_duration_sec=round(duration_sec, 2),
            reference_text=reference_text,
            comparisons=comparisons,
        )
    finally:
        Path(tmp_path).unlink(missing_ok=True)
        Path(f"{tmp_path}_16k.wav").unlink(missing_ok=True)
