from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@db:5432/inventory"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    low_stock_threshold: int = 10

    class Config:
        env_file = ".env"


settings = Settings()
