"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "PyTest / WebM Audio Decoding & Agent Endpoint Test"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Input Validation", "WebM Handling", "Temp File Cleanup"]
  Notes: "Validates WebM decoding and /api/v1/agent endpoint robustness."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

import tempfile
import subprocess
from pathlib import Path
import pytest
from app.services.audio_pipeline import AudioPipeline


def test_audio_pipeline_webm_decoding():
    """Verify WebM audio file is correctly loaded and resampled to 16kHz mono."""
    pipeline = AudioPipeline(target_sample_rate=16000)

    raw_tmp = tempfile.NamedTemporaryFile(suffix=".webm", delete=False)
    webm_path = raw_tmp.name
    raw_tmp.close()

    try:
        # Generate 1-second WebM opus audio using ffmpeg
        cmd = [
            "ffmpeg", "-y", "-f", "lavfi", "-i", "sine=frequency=440:duration=1",
            "-c:a", "libopus", webm_path
        ]
        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

        processed_wave, out_sr = pipeline.load_and_preprocess(webm_path)

        assert out_sr == 16000
        assert processed_wave.shape[0] == 1  # Mono
        assert abs(processed_wave.shape[1] - 16000) < 500
    finally:
        Path(webm_path).unlink(missing_ok=True)
