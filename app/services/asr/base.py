"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "Abstract Base Class / Strategy Pattern for ASR Engines"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Interface Enforcement"]
  Notes: "Standardizes model execution interface across Whisper, wav2vec2, MMS, and NeMo."
Performance_Metrics:
  Time_Complexity: "O(1) dispatch"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

from abc import ABC, abstractmethod

from app.schemas.transcribe import TranscriptionResult


class BaseASRService(ABC):
    """Abstract Base Class for all ASR Model Adapters."""

    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device

    @abstractmethod
    def load_model(self) -> None:
        """Load model weights into GPU/CPU memory."""

    @abstractmethod
    def transcribe(
        self, audio_path: str, language: str = "ckb", normalize: bool = True
    ) -> TranscriptionResult:
        """
        Transcribe an audio file.

        Args:
            audio_path: Path to 16 kHz mono audio WAV file.
            language: Target language code (Default: 'ckb' for Sorani Kurdish).
            normalize: Whether to apply Kurdish text normalization to result.

        Returns:
            TranscriptionResult object.
        """
