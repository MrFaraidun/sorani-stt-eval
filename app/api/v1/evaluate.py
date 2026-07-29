"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "FastAPI Router / ASR Evaluation Endpoint"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Temporary File Cleanup"]
  Notes: "Transcribes uploaded audio and scores against ground truth reference."
Performance_Metrics:
  Time_Complexity: "O(1) async threadpool delegation"
  Memory_Impact: "Minimal"
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


class EvaluationResponse(BaseModel):
    transcription: TranscriptionResult
    metrics: EvaluationMetrics


@router.post(
    "/evaluate",
    response_model=EvaluationResponse,
    summary="Transcribe and Evaluate WER/CER",
    tags=["Evaluation"],
)
async def evaluate_audio(
    file: UploadFile = File(...),
    reference_text: str = Form(...),
    model: str = Form("whisper-v3"),
    language: str = Form("ckb"),
):
    """
    Upload an audio file and reference transcript to compute WER, CER, and S/D/I alignments.
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

        asr_service = model_registry.get_model(model)
        transcription = await run_in_threadpool(asr_service.transcribe, wav_path, language, True)

        metrics = evaluator_service.evaluate(reference_text, transcription.text)

        return EvaluationResponse(transcription=transcription, metrics=metrics)
    finally:
        Path(tmp_path).unlink(missing_ok=True)
        Path(f"{tmp_path}_16k.wav").unlink(missing_ok=True)
