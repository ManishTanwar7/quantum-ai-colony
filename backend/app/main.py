import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.api import api_router
from app.api.colony import router as colony_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    Base.metadata.create_all(bind=engine)
    # Seed sample database
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Health check
@app.get("/healthz")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": settings.DATABASE_URL.split("://")[0]
    }

# Static file serving (Single-service Render deployment support)
# Check multiple possible frontend build locations
frontend_dist_paths = [
    os.path.abspath("frontend/dist"),
    os.path.abspath("static"),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../static")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../static")),
    os.path.abspath("dist"),
]

static_dir = None
for path in frontend_dist_paths:
    if os.path.exists(path) and os.path.exists(os.path.join(path, "index.html")):
        static_dir = path
        break

if static_dir:
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Don't hijack API or WebSocket paths
        if full_path.startswith("api/") or full_path.startswith("ws"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        
        file_path = os.path.join(static_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
else:
    @app.get("/")
    def root_info():
        return {
            "message": f"Welcome to {settings.PROJECT_NAME} API backend.",
            "docs": "/docs",
            "health": "/healthz",
            "frontend_status": "Run frontend development server or build frontend to dist/"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=10000, reload=True)
