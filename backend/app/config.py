import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuMind API"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    MAX_FILE_SIZE_MB: int = 15
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    TESSERACT_CMD: str = os.getenv("TESSERACT_CMD", "")  # Optional override if not in PATH

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
