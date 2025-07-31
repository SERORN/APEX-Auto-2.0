from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from typing import Optional, Dict, Any


class TransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"
    PAYMENT = "payment"
    REFUND = "refund"
    TRANSFER = "transfer"
    CREDIT = "credit"
    CASHBACK = "cashback"
    FEE = "fee"
    FACTORING = "factoring"
    CREDIT_PAYMENT = "credit_payment"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, enum.Enum):
    WALLET = "wallet"
    CREDIT = "credit"
    BANK_TRANSFER = "bank_transfer"
    CARD = "card"
    CASH = "cash"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False, index=True)
    
    # Transaction Details
    transaction_id = Column(String(50), unique=True, index=True, nullable=False)
    type = Column(Enum(TransactionType), nullable=False, index=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING, nullable=False)
    
    # Amounts
    amount = Column(Float, nullable=False)
    fee = Column(Float, default=0.0, nullable=False)
    net_amount = Column(Float, nullable=False)  # amount - fee
    
    # Currency and Exchange
    currency = Column(String(3), default="MXN", nullable=False)
    exchange_rate = Column(Float, default=1.0, nullable=False)
    
    # References
    reference = Column(String(255), nullable=True)
    external_id = Column(String(100), nullable=True, index=True)  # Bank/Payment provider ID
    
    # Payment Information
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_details = Column(JSON, nullable=True)  # Card last 4, bank info, etc.
    
    # Related Entities
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)
    credit_line_id = Column(Integer, ForeignKey("credit_lines.id"), nullable=True)
    
    # Counterparty (for transfers)
    counterparty_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    counterparty_wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=True)
    
    # Description and Metadata
    description = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)  # Additional data
    
    # Processing Information
    processed_at = Column(DateTime(timezone=True), nullable=True)
    failure_reason = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="transactions")
    wallet = relationship("Wallet", back_populates="transactions")
    invoice = relationship("Invoice", back_populates="transactions")
    credit_line = relationship("CreditLine", back_populates="transactions")
    
    # Counterparty relationships
    counterparty_user = relationship("User", foreign_keys=[counterparty_user_id])
    counterparty_wallet = relationship("Wallet", foreign_keys=[counterparty_wallet_id])
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, type={self.type}, amount={self.amount}, status={self.status})>"
    
    @property
    def is_credit_transaction(self) -> bool:
        """Check if this is a credit-related transaction."""
        return self.type in [TransactionType.CREDIT, TransactionType.CREDIT_PAYMENT]
    
    @property
    def is_completed(self) -> bool:
        """Check if transaction is completed."""
        return self.status == TransactionStatus.COMPLETED
    
    @property
    def is_pending(self) -> bool:
        """Check if transaction is pending."""
        return self.status == TransactionStatus.PENDING
    
    @property
    def can_be_refunded(self) -> bool:
        """Check if transaction can be refunded."""
        return (
            self.status == TransactionStatus.COMPLETED and
            self.type in [TransactionType.PAYMENT, TransactionType.TRANSFER]
        )
