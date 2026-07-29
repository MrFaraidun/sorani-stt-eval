"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "FastAPI Router / Model Registry Information Endpoint"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["N/A"]
  Notes: "Exposes list of supported ASR models."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""


from fastapi import APIRouter

from app.services.model_registry import model_registry

router = APIRouter()


@router.get(
    "/models",
    summary="List Available ASR Models",
    tags=["System"],
)
async def list_models() -> list[dict[str, str]]:
    """List available ASR model engines and identifiers."""
    return model_registry.list_available_models()
