import os
from typing import Optional

class Settings:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///workforce_transformer.db")
        self.api_key = os.getenv("API_KEY", "dev-api-key")
        self.debug = os.getenv("DEBUG", "true").lower() == "true"
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self.cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.model_cache_dir = os.getenv("MODEL_CACHE_DIR", "./models/cache")
        self.data_dir = os.getenv("DATA_DIR", "../")
