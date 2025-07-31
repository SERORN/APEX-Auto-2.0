from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/apex_db"
    DATABASE_URL_SYNC: str = "postgresql://user:password@localhost/apex_db"
    
    # Application
    PROJECT_NAME: str = "Apex Fintech & Automotive"
    DEBUG: bool = True
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Third Party APIs
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    PLAID_CLIENT_ID: Optional[str] = None
    PLAID_SECRET: Optional[str] = None
    PLAID_ENV: str = "sandbox"
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # SMS
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Mexican Services
    SAT_USER: Optional[str] = None
    SAT_PASSWORD: Optional[str] = None
    SAT_ENDPOINT: str = "https://sat.gob.mx/api"
    
    # AutoPartes
    AUTOPARTES_API_KEY: Optional[str] = None
    AUTOPARTES_API_URL: str = "https://api.autopartes.com/v1"
    
    # Financial Services
    KONFIO_API_KEY: Optional[str] = None
    KONFIO_API_URL: str = "https://api.konfio.mx/v1"
    
    KUESKI_API_KEY: Optional[str] = None
    KUESKI_API_URL: str = "https://api.kueski.com/v1"
    
    FACTURAMA_USER: Optional[str] = None
    FACTURAMA_PASSWORD: Optional[str] = None
    FACTURAMA_API_URL: str = "https://api.facturama.mx"
    
    # Company Info
    COMPANY_NAME: str = "Apex Fintech & Automotive"
    COMPANY_RFC: str = "APEX010101ABC"
    COMPANY_ADDRESS: str = "Av. Revolución 123, CDMX"
    COMPANY_PHONE: str = "+52-55-1234-5678"
    COMPANY_EMAIL: str = "contacto@apex.com.mx"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
