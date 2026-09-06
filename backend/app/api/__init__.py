from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.circuits import router as circuits_router
from app.api.colony import router as colony_router
from app.api.learning import router as learning_router
from app.api.instructor import router as instructor_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(circuits_router)
api_router.include_router(colony_router)
api_router.include_router(learning_router)
api_router.include_router(instructor_router)

__all__ = ["api_router"]
