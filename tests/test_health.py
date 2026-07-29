"""
Review_Type: "Human-in-the-Loop Validation"
Target_Architecture: "PyTest / FastAPI TestClient"
Security_Assessment:
  Risk_Level: "Low"
  Vulnerabilities_Checked: ["N/A"]
  Notes: "Unit testing liveness probe contract."
Performance_Metrics:
  Time_Complexity: "O(1)"
  Memory_Impact: "Minimal"
Scalability_Rating: "Approved"
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /health returns 200 OK and valid status payloads."""
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert "app_name" in data
    assert "device" in data
    assert "cuda_available" in data
    assert "pytorch_version" in data
