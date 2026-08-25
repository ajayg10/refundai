"""
Application configuration — reads from environment variables / .env file.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:refundguard@localhost:5432/refundguard"

    # TrueForge
    trueforge_base_url: str = "http://localhost:8790"

    # Daytona (sandbox)
    daytona_api_key: str = ""

    # Google Gemini
    google_api_key: str = ""

    # App
    app_env: str = "development"
    secret_key: str = "change-me-in-production"
    backend_url: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
