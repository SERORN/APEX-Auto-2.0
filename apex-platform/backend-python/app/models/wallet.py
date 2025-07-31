from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from typing import Optional


class WalletStatus(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CLOSED = "closed"


class Currency(str, enum.Enum):
    MXN = "MXN"
    USD = "USD"


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Balance Information
    balance = Column(Float, default=0.0, nullable=False)
    available_balance = Column(Float, default=0.0, nullable=False)
    frozen_balance = Column(Float, default=0.0, nullable=False)
    
    # Credit Information
    credit_limit = Column(Float, default=0.0, nullable=False)
    used_credit = Column(Float, default=0.0, nullable=False)
    available_credit = Column(Float, default=0.0, nullable=False)
    
    # Cashback
    cashback_balance = Column(Float, default=0.0, nullable=False)
    total_cashback_earned = Column(Float, default=0.0, nullable=False)
    
    # Wallet Configuration
    currency = Column(Enum(Currency), default=Currency.MXN, nullable=False)
    status = Column(Enum(WalletStatus), default=WalletStatus.ACTIVE, nullable=False)
    
    # Limits and Controls
    daily_limit = Column(Float, default=50000.0, nullable=False)  # $50k MXN
    monthly_limit = Column(Float, default=500000.0, nullable=False)  # $500k MXN
    withdrawal_limit = Column(Float, default=20000.0, nullable=False)  # $20k MXN
    
    # Metadata
    wallet_number = Column(String(20), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_transaction_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="wallets")
    transactions = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Wallet(id={self.id}, user_id={self.user_id}, balance={self.balance})>"
    
    @property
    def total_available(self) -> float:
        """Total available funds (balance + available credit)."""
        return self.available_balance + self.available_credit
    
    @property
    def utilization_rate(self) -> float:
        """Credit utilization rate as percentage."""
        if self.credit_limit == 0:
            return 0.0
        return (self.used_credit / self.credit_limit) * 100
    
    def can_withdraw(self, amount: float) -> bool:
        """Check if user can withdraw the specified amount."""
        return (
            self.status == WalletStatus.ACTIVE and
            amount <= self.available_balance and
            amount <= self.withdrawal_limit
        )
    
    def can_spend(self, amount: float) -> bool:
        """Check if user can spend the specified amount."""
        return (
            self.status == WalletStatus.ACTIVE and
            amount <= self.total_available
        )
    
    def update_credit_available(self):
        """Update available credit based on limit and used credit."""
        self.available_credit = max(0, self.credit_limit - self.used_credit)
