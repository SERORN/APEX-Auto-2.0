from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from typing import Optional, List, Dict, Any


class ProductCategory(str, enum.Enum):
    ENGINE_PARTS = "engine_parts"
    BRAKES = "brakes"
    SUSPENSION = "suspension"
    ELECTRICAL = "electrical"
    FILTERS = "filters"
    OILS_FLUIDS = "oils_fluids"
    BODY_PARTS = "body_parts"
    TRANSMISSION = "transmission"
    COOLING = "cooling"
    EXHAUST = "exhaust"
    INTERIOR = "interior"
    EXTERIOR = "exterior"
    TOOLS = "tools"
    ACCESSORIES = "accessories"


class ProductCondition(str, enum.Enum):
    NEW = "new"
    USED = "used"
    REFURBISHED = "refurbished"
    REBUILT = "rebuilt"


class ProductStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"


class AutoPart(Base):
    __tablename__ = "autoparts"

    id = Column(Integer, primary_key=True, index=True)
    
    # Product Identification
    sku = Column(String(50), unique=True, index=True, nullable=False)
    part_number = Column(String(100), index=True, nullable=False)
    oem_number = Column(String(100), nullable=True, index=True)
    universal_part_number = Column(String(100), nullable=True)
    
    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(Enum(ProductCategory), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    
    # Brand and Manufacturer
    brand = Column(String(100), nullable=False, index=True)
    manufacturer = Column(String(100), nullable=True)
    country_of_origin = Column(String(50), nullable=True)
    
    # Vehicle Compatibility
    compatible_makes = Column(JSON, nullable=True)  # ["Toyota", "Honda"]
    compatible_models = Column(JSON, nullable=True)  # ["Corolla", "Civic"]
    compatible_years = Column(JSON, nullable=True)   # [2015, 2016, 2017]
    engine_types = Column(JSON, nullable=True)       # ["1.8L", "2.0L"]
    
    # Product Details
    condition = Column(Enum(ProductCondition), default=ProductCondition.NEW, nullable=False)
    warranty_months = Column(Integer, default=12, nullable=False)
    warranty_description = Column(Text, nullable=True)
    
    # Pricing
    cost_price = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    msrp = Column(Float, nullable=True)  # Manufacturer suggested retail price
    discount_percentage = Column(Float, default=0.0, nullable=False)
    
    # Inventory
    stock_quantity = Column(Integer, default=0, nullable=False)
    reserved_quantity = Column(Integer, default=0, nullable=False)
    available_quantity = Column(Integer, default=0, nullable=False)
    minimum_stock = Column(Integer, default=1, nullable=False)
    maximum_stock = Column(Integer, default=100, nullable=False)
    
    # Physical Properties
    weight_kg = Column(Float, nullable=True)
    dimensions_cm = Column(JSON, nullable=True)  # {"length": 10, "width": 5, "height": 2}
    volume_cm3 = Column(Float, nullable=True)
    
    # Status and Visibility
    status = Column(Enum(ProductStatus), default=ProductStatus.ACTIVE, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_bestseller = Column(Boolean, default=False, nullable=False)
    
    # SEO and Marketing
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    keywords = Column(JSON, nullable=True)  # ["brake pads", "toyota", "ceramic"]
    
    # Images and Media
    primary_image_url = Column(String(500), nullable=True)
    image_urls = Column(JSON, nullable=True)  # List of image URLs
    video_url = Column(String(500), nullable=True)
    installation_guide_url = Column(String(500), nullable=True)
    
    # Sales Metrics
    total_sold = Column(Integer, default=0, nullable=False)
    total_revenue = Column(Float, default=0.0, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)
    rating_average = Column(Float, default=0.0, nullable=False)
    rating_count = Column(Integer, default=0, nullable=False)
    
    # Supplier Information
    supplier_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    supplier_sku = Column(String(100), nullable=True)
    lead_time_days = Column(Integer, default=7, nullable=False)
    minimum_order_quantity = Column(Integer, default=1, nullable=False)
    
    # Additional Information
    installation_difficulty = Column(String(20), nullable=True)  # easy, medium, hard, professional
    tools_required = Column(JSON, nullable=True)  # List of required tools
    special_notes = Column(Text, nullable=True)
    hazmat = Column(Boolean, default=False, nullable=False)  # Hazardous material
    
    # Metadata
    metadata = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_sold_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    supplier = relationship("User", foreign_keys=[supplier_id])
    
    def __repr__(self):
        return f"<AutoPart(id={self.id}, sku={self.sku}, name={self.name}, price={self.selling_price})>"
    
    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock."""
        return self.available_quantity > 0
    
    @property
    def is_low_stock(self) -> bool:
        """Check if product is low in stock."""
        return self.available_quantity <= self.minimum_stock
    
    @property
    def profit_margin(self) -> float:
        """Calculate profit margin percentage."""
        if self.cost_price == 0:
            return 0.0
        return ((self.selling_price - self.cost_price) / self.cost_price) * 100
    
    @property
    def final_price(self) -> float:
        """Calculate final price after discount."""
        if self.discount_percentage > 0:
            return self.selling_price * (1 - self.discount_percentage / 100)
        return self.selling_price
    
    def is_compatible_with_vehicle(self, make: str, model: str, year: int) -> bool:
        """Check if part is compatible with specific vehicle."""
        if self.compatible_makes and make not in self.compatible_makes:
            return False
        if self.compatible_models and model not in self.compatible_models:
            return False
        if self.compatible_years and year not in self.compatible_years:
            return False
        return True
    
    def update_stock(self, quantity_sold: int):
        """Update stock after sale."""
        self.stock_quantity = max(0, self.stock_quantity - quantity_sold)
        self.available_quantity = max(0, self.stock_quantity - self.reserved_quantity)
        self.total_sold += quantity_sold
        
        # Update status if out of stock
        if self.available_quantity == 0:
            self.status = ProductStatus.OUT_OF_STOCK
    
    def reserve_stock(self, quantity: int) -> bool:
        """Reserve stock for pending orders."""
        if self.available_quantity >= quantity:
            self.reserved_quantity += quantity
            self.available_quantity -= quantity
            return True
        return False
    
    def release_reserved_stock(self, quantity: int):
        """Release reserved stock back to available."""
        released = min(quantity, self.reserved_quantity)
        self.reserved_quantity -= released
        self.available_quantity += released
