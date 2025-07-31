from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from typing import Optional, List, Dict, Any


class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentTerms(str, enum.Enum):
    IMMEDIATE = "immediate"
    NET_15 = "net_15"
    NET_30 = "net_30"
    NET_60 = "net_60"
    NET_90 = "net_90"


class CFDIUse(str, enum.Enum):
    ADQUISICION_MERCANCIAS = "G01"
    DEVOLUCIONES_DESCUENTOS = "G02"
    GASTOS_GENERALES = "G03"
    CONSTRUCCIONES = "I01"
    MOBILIARIO_EQUIPO = "I02"
    EQUIPO_TRANSPORTE = "I03"
    EQUIPO_COMPUTO = "I04"
    DADOS_TROQUELES = "I05"
    COMUNICACIONES_TELEFONICAS = "I06"
    COMUNICACIONES_SATELITALES = "I07"
    OTRA_MAQUINARIA = "I08"
    HONORARIOS_MEDICOS = "D01"
    GASTOS_MEDICOS = "D02"
    GASTOS_FUNERALES = "D03"
    DONATIVOS = "D04"
    INTERESES_CREDITOS_HIPOTECARIOS = "D05"
    APORTACIONES_VOLUNTARIAS_SAR = "D06"
    PRIMAS_SEGUROS_GASTOS_MEDICOS = "D07"
    GASTOS_TRANSPORTACION_ESCOLAR = "D08"
    DEPOSITOS_CUENTAS_AHORRO = "D09"
    PAGOS_SERVICIOS_EDUCATIVOS = "D10"
    SIN_EFECTOS_FISCALES = "S01"
    PAGOS = "CP01"
    NOMINA = "CN01"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    
    # Invoice Identification
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    folio = Column(String(20), nullable=True)  # Internal folio
    series = Column(String(10), nullable=True)  # Invoice series
    
    # Parties
    issuer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Financial Information
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0, nullable=False)
    discount_amount = Column(Float, default=0.0, nullable=False)
    total = Column(Float, nullable=False)
    currency = Column(String(3), default="MXN", nullable=False)
    exchange_rate = Column(Float, default=1.0, nullable=False)
    
    # Status and Dates
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT, nullable=False)
    issue_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=False)
    paid_date = Column(DateTime(timezone=True), nullable=True)
    
    # Payment Information
    payment_terms = Column(Enum(PaymentTerms), default=PaymentTerms.NET_30, nullable=False)
    payment_method = Column(String(10), default="PUE", nullable=False)  # PUE or PPD
    payment_form = Column(String(10), default="99", nullable=False)  # Forma de pago SAT
    
    # CFDI Information (Mexico)
    cfdi_uuid = Column(String(36), unique=True, nullable=True, index=True)
    cfdi_use = Column(Enum(CFDIUse), default=CFDIUse.GASTOS_GENERALES, nullable=False)
    cfdi_xml_url = Column(String(500), nullable=True)
    cfdi_pdf_url = Column(String(500), nullable=True)
    cfdi_status = Column(String(20), default="pending", nullable=False)  # pending, issued, cancelled
    cfdi_cancellation_date = Column(DateTime(timezone=True), nullable=True)
    
    # Invoice Items (stored as JSON for flexibility)
    items = Column(JSON, nullable=False)  # List of invoice items
    
    # Additional Information
    notes = Column(Text, nullable=True)
    terms_and_conditions = Column(Text, nullable=True)
    
    # Factoring Information
    factoring_available = Column(Boolean, default=True, nullable=False)
    factoring_rate = Column(Float, nullable=True)  # If factored, the rate applied
    factored_amount = Column(Float, nullable=True)  # Amount received from factoring
    factoring_date = Column(DateTime(timezone=True), nullable=True)
    factoring_provider = Column(String(100), nullable=True)  # Konfío, etc.
    
    # Metadata
    metadata = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    issuer = relationship("User", foreign_keys=[issuer_id], back_populates="invoices_issued")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="invoices_received")
    transactions = relationship("Transaction", back_populates="invoice")
    
    def __repr__(self):
        return f"<Invoice(id={self.id}, number={self.invoice_number}, total={self.total}, status={self.status})>"
    
    @property
    def is_overdue(self) -> bool:
        """Check if invoice is overdue."""
        from datetime import datetime
        return (
            self.status in [InvoiceStatus.SENT] and
            self.due_date < datetime.now()
        )
    
    @property
    def days_until_due(self) -> int:
        """Days until invoice is due (negative if overdue)."""
        from datetime import datetime
        delta = self.due_date - datetime.now()
        return delta.days
    
    @property
    def can_be_factored(self) -> bool:
        """Check if invoice can be factored."""
        return (
            self.factoring_available and
            self.status == InvoiceStatus.SENT and
            not self.factored_amount and
            self.total >= 10000  # Minimum amount for factoring
        )
    
    @property
    def has_cfdi(self) -> bool:
        """Check if invoice has CFDI."""
        return bool(self.cfdi_uuid)
    
    def calculate_factoring_rate(self) -> float:
        """Calculate factoring rate based on invoice characteristics."""
        base_rate = 2.5  # 2.5% base rate
        
        # Adjust based on days until due
        days_due = self.days_until_due
        if days_due > 60:
            rate_adjustment = 0.5
        elif days_due > 30:
            rate_adjustment = 0.3
        else:
            rate_adjustment = 0.1
        
        # Adjust based on invoice amount
        if self.total > 500000:  # Large invoices get better rates
            amount_adjustment = -0.2
        elif self.total > 100000:
            amount_adjustment = -0.1
        else:
            amount_adjustment = 0.0
        
        return base_rate + rate_adjustment + amount_adjustment
