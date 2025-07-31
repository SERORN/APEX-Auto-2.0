from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, KYCStatus


class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    business_name: Optional[str] = Field(None, max_length=255)
    rfc: Optional[str] = Field(None, min_length=12, max_length=13)
    role: Optional[UserRole] = UserRole.CUSTOMER


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    business_name: Optional[str] = Field(None, max_length=255)
    rfc: Optional[str] = Field(None, min_length=12, max_length=13)
    fiscal_address: Optional[str] = None
    fiscal_regime: Optional[str] = None
    monthly_income: Optional[float] = Field(None, ge=0)


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    kyc_status: KYCStatus
    credit_score: int
    monthly_income: float
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
