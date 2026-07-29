"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "PyTest / Audio Pipeline Unit Test"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["N/A"]
  Notes: "Synthesizes sine waves to test resampling, mono downmixing, and normalization."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

import tempfile
from pathlib import Path

import torch

from app.services.audio_pipeline import AudioPipeline


def test_audio_pipeline_downmix_and_resample():
    """Verify stereo 44.1 kHz audio is downmixed to mono and resampled to 16 kHz."""
    pipeline = AudioPipeline(target_sample_rate=16000)

    # Synthesize 1-second stereo 44.1 kHz sine wave audio
    sr = 44100
    t = torch.linspace(0, 1, sr)
    ch1 = torch.sin(2 * 3.14159 * 440 * t)  # 440 Hz tone
    ch2 = torch.cos(2 * 3.14159 * 880 * t)  # 880 Hz tone
    stereo_wave = torch.stack([ch1, ch2], dim=0)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        import soundfile as sf
        sf.write(tmp_path, stereo_wave.T.numpy(), sr, subtype="PCM_16")

        # Process through pipeline
        processed_wave, out_sr = pipeline.load_and_preprocess(tmp_path)

        # Assertions
        assert out_sr == 16000
        assert processed_wave.shape[0] == 1  # Mono
        assert abs(processed_wave.shape[1] - 16000) < 100  # Approx 1 sec at 16kHz
        # Check peak amplitude is normalized to -1 dBFS (0.891)
        max_amp = torch.max(torch.abs(processed_wave)).item()
        assert abs(max_amp - 0.891) < 1e-3
    finally:
        Path(tmp_path).unlink(missing_ok=True)
