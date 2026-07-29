"""Aggregated API v1 router."""

from fastapi import APIRouter

from app.api.v1.agent import router as agent_router
from app.api.v1.compare import router as compare_router
from app.api.v1.evaluate import router as evaluate_router
from app.api.v1.models import router as models_router
from app.api.v1.transcribe import router as transcribe_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(transcribe_router)
api_v1_router.include_router(evaluate_router)
api_v1_router.include_router(compare_router)
api_v1_router.include_router(models_router)
api_v1_router.include_router(agent_router)
