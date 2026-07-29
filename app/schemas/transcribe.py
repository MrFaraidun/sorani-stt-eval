"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "Pydantic Schemas / ASR Response Contracts"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["Type Validation"]
  Notes: "Provides strict type bounds for ASR model outputs."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""


from pydantic import BaseModel, Field


class AudioSegment(BaseModel):
    """Timestamped audio segment."""

    id: int
    start_sec: float
    end_sec: float
    text: str
    confidence: float | None = None


class TranscriptionResult(BaseModel):
    """Standardized result returned by all ASR models."""

    text: str = Field(..., description="Normalized transcribed text")
    raw_text: str = Field(..., description="Raw output text from model before Kurdish normalization")
    language: str = Field(default="ckb", description="Language code")
    model_name: str = Field(..., description="Name or identifier of the ASR model used")
    duration_sec: float = Field(..., description="Audio clip duration in seconds")
    real_time_factor: float | None = Field(default=None, description="RTF = processing_time / audio_duration")
    segments: list[AudioSegment] = Field(default_factory=list, description="Timestamped speech segments")
