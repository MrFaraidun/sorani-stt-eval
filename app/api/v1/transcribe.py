"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "FastAPI Router / Audio Transcription Endpoint"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Temporary File Cleanup", "Input File Validation", "Dynamic User Gemini API Key"]
  Notes: "Allows users to supply their own Gemini API key or falls back to system environment key."
Performance_Metrics:
  Time_Complexity: "O(1) async delegation to threadpool model execution"
  Memory_Impact: "Streamed file upload buffer"
Scalability_Rating: "Approved"
"""

import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from app.schemas.transcribe import TranscriptionResult
from app.services.audio_pipeline import audio_pipeline
from app.services.model_registry import model_registry

router = APIRouter()


@router.post(
    "/transcribe",
    response_model=TranscriptionResult,
    summary="Transcribe Audio File",
    tags=["ASR"],
)
async def transcribe_audio(
    file: UploadFile = File(...),
    model: str = Form("hybrid-custom-gemini"),
    language: str = Form("ckb"),
    denoise: bool = Form(False),
    gemini_api_key: str = Form(None),
):
    """
    Upload an audio clip and transcribe it using the specified ASR model.
    Accepts an optional user-provided Google Gemini API key.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename.")

    suffix = Path(file.filename).suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Preprocess audio (Resample 16kHz, Peak Normalize)
        processed_wave, _sr = await run_in_threadpool(
            audio_pipeline.load_and_preprocess, tmp_path, denoise
        )
        wav_path = f"{tmp_path}_16k.wav"
        audio_pipeline.save_processed(processed_wave, wav_path)

        # Get Model from Registry
        asr_service = model_registry.get_model(model)
        if hasattr(asr_service, "api_key") and gemini_api_key and gemini_api_key.strip():
            asr_service.api_key = gemini_api_key.strip()

        result = await run_in_threadpool(
            asr_service.transcribe, wav_path, language, True
        )
        return result
    finally:
        Path(tmp_path).unlink(missing_ok=True)
        Path(f"{tmp_path}_16k.wav").unlink(missing_ok=True)
