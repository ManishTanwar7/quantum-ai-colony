import os

class Settings:
    PROJECT_NAME: str = "Quantum AI Colony"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database: fallback to local SQLite if DATABASE_URL is not set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./quantum_colony.db")
    
    # JWT Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "quantum_colony_super_secure_secret_key_2026_production_grade_32bytes_long")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Simulation Limits
    MAX_QUBITS: int = 8
    DEFAULT_SHOTS: int = 1024
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://quantum-ai-colony.onrender.com",
        "*"
    ]

settings = Settings()

# Fix for postgres:// prefix on Render (SQLAlchemy requires postgresql://)
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)
