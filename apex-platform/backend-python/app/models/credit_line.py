from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from typing import Optional, Dict, Any


class CreditStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CLOSED = "closed"
    DEFAULTED = "defaulted"


class CreditType(str, enum.Enum):
    WORKING_CAPITAL = "working_capital"
    INVENTORY = "inventory"
    EQUIPMENT = "equipment"
    EXPANSION = "expansion"
    EMERGENCY = "emergency"


class PaymentFrequency(str, enum.Enum):
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"


class CreditLine(Base):
    __tablename__ = "credit_lines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Credit Line Identification
    credit_line_number = Column(String(50), unique=True, index=True, nullable=False)
    credit_type = Column(Enum(CreditType), nullable=False)
    
    # Credit Amounts
    approved_limit = Column(Float, nullable=False)
    current_limit = Column(Float, nullable=False)  # Can be adjusted over time
    used_amount = Column(Float, default=0.0, nullable=False)
    available_amount = Column(Float, nullable=False)
    
    # Interest and Terms
    interest_rate = Column(Float, nullable=False)  # Annual percentage rate
    payment_frequency = Column(Enum(PaymentFrequency), default=PaymentFrequency.MONTHLY, nullable=False)
    term_months = Column(Integer, nullable=False)  # Total term in months
    
    # Status and Dates
    status = Column(Enum(CreditStatus), default=CreditStatus.PENDING, nullable=False)
    application_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    approval_date = Column(DateTime(timezone=True), nullable=True)
    activation_date = Column(DateTime(timezone=True), nullable=True)
    maturity_date = Column(DateTime(timezone=True), nullable=True)
    
    # Provider Information
    provider = Column(String(100), nullable=False)  # Kueski, etc.
    provider_id = Column(String(100), nullable=True)  # External provider ID
    
    # Risk Assessment
    credit_score_at_approval = Column(Integer, nullable=True)
    debt_to_income_ratio = Column(Float, nullable=True)
    risk_category = Column(String(20), nullable=True)  # low, medium, high
    
    # Payment Information
    minimum_payment = Column(Float, default=0.0, nullable=False)
    next_payment_date = Column(DateTime(timezone=True), nullable=True)
    next_payment_amount = Column(Float, default=0.0, nullable=False)
    last_payment_date = Column(DateTime(timezone=True), nullable=True)
    
    # Performance Metrics
    total_payments_made = Column(Integer, default=0, nullable=False)
    total_amount_paid = Column(Float, default=0.0, nullable=False)
    total_interest_paid = Column(Float, default=0.0, nullable=False)
    days_past_due = Column(Integer, default=0, nullable=False)
    late_payment_count = Column(Integer, default=0, nullable=False)
    
    # Collateral and Guarantees
    collateral_required = Column(Boolean, default=False, nullable=False)
    collateral_description = Column(Text, nullable=True)
    guarantee_required = Column(Boolean, default=False, nullable=False)
    guarantee_details = Column(JSON, nullable=True)
    
    # Additional Information
    purpose = Column(Text, nullable=True)
    application_notes = Column(Text, nullable=True)
    approval_notes = Column(Text, nullable=True)
    
    # Metadata
    metadata = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="credit_lines")
    transactions = relationship("Transaction", back_populates="credit_line")
    
    def __repr__(self):
        return f"<CreditLine(id={self.id}, user_id={self.user_id}, limit={self.current_limit}, status={self.status})>"
    
    @property
    def utilization_rate(self) -> float:
        """Credit utilization rate as percentage."""
        if self.current_limit == 0:
            return 0.0
        return (self.used_amount / self.current_limit) * 100
    
    @property
    def is_active(self) -> bool:
        """Check if credit line is active."""
        return self.status == CreditStatus.ACTIVE
    
    @property
    def is_overdue(self) -> bool:
        """Check if there are overdue payments."""
        return self.days_past_due > 0
    
    @property
    def payment_status(self) -> str:
        """Get current payment status."""
        if self.days_past_due == 0:
            return "current"
        elif self.days_past_due <= 30:
            return "late"
        elif self.days_past_due <= 90:
            return "delinquent"
        else:
            return "default"
    
    def calculate_monthly_payment(self) -> float:
        """Calculate minimum monthly payment."""
        if self.used_amount == 0:
            return 0.0
        
        monthly_rate = self.interest_rate / 12 / 100
        remaining_months = self.term_months - self.total_payments_made
        
        if remaining_months <= 0:
            return self.used_amount  # Pay full amount if term expired
        
        # Calculate using amortization formula
        if monthly_rate == 0:
            return self.used_amount / remaining_months
        
        payment = (self.used_amount * monthly_rate * (1 + monthly_rate) ** remaining_months) / \
                 ((1 + monthly_rate) ** remaining_months - 1)
        
        return round(payment, 2)
    
    def can_draw(self, amount: float) -> bool:
        """Check if user can draw the specified amount."""
        return (
            self.is_active and
            amount <= self.available_amount and
            not self.is_overdue
        )
    
    def update_available_amount(self):
        """Update available amount based on current limit and used amount."""
        self.available_amount = max(0, self.current_limit - self.used_amount)
