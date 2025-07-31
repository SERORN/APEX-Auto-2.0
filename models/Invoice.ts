import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface IInvoice extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'MXN' | 'USD';
  dueDate: Date;
  status: 'pendiente' | 'anticipado' | 'pagado' | 'vencido' | 'cancelado';
  cfdiData?: {
    uuid: string;
    xmlUrl: string;
    pdfUrl: string;
    satStatus: 'vigente' | 'cancelado';
    generatedAt: Date;
  };
  factoringData?: {
    partnerId: string;
    partnerName: string;
    requestedAt: Date;
    approvedAt?: Date;
    anticipatedAmount: number;
    feePercentage: number;
    status: 'pendiente' | 'aprobado' | 'rechazado';
  };
  invoiceNumber: string;
  description: string;
  clientInfo: {
    name: string;
    rfc: string;
    email: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    satCode: string;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentForm: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const InvoiceSchema: Schema<IInvoice> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0.01, 'El monto debe ser mayor a 0']
  },
  currency: {
    type: String,
    enum: ['MXN', 'USD'],
    default: 'MXN',
    required: true
  },
  dueDate: {
    type: Date,
    required: [true, 'La fecha de vencimiento es requerida']
  },
  status: {
    type: String,
    enum: ['pendiente', 'anticipado', 'pagado', 'vencido', 'cancelado'],
    default: 'pendiente',
    required: true
  },
  cfdiData: {
    uuid: {
      type: String,
      unique: true,
      sparse: true // Permite múltiples documentos con valor null
    },
    xmlUrl: String,
    pdfUrl: String,
    satStatus: {
      type: String,
      enum: ['vigente', 'cancelado'],
      default: 'vigente'
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  factoringData: {
    partnerId: String,
    partnerName: String,
    requestedAt: Date,
    approvedAt: Date,
    anticipatedAmount: {
      type: Number,
      min: [0, 'El monto anticipado no puede ser negativo']
    },
    feePercentage: {
      type: Number,
      min: [0, 'El porcentaje de comisión no puede ser negativo'],
      max: [100, 'El porcentaje de comisión no puede exceder 100%']
    },
    status: {
      type: String,
      enum: ['pendiente', 'aprobado', 'rechazado'],
      default: 'pendiente'
    }
  },
  invoiceNumber: {
    type: String,
    required: [true, 'El número de factura es requerido'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  clientInfo: {
    name: {
      type: String,
      required: [true, 'El nombre del cliente es requerido']
    },
    rfc: {
      type: String,
      required: [true, 'El RFC del cliente es requerido'],
      uppercase: true,
      match: [/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'Formato de RFC inválido']
    },
    email: {
      type: String,
      required: [true, 'El email del cliente es requerido'],
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
    },
    address: {
      type: String,
      required: [true, 'La dirección del cliente es requerida']
    }
  },
  items: [{
    description: {
      type: String,
      required: [true, 'La descripción del item es requerida']
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [0.01, 'La cantidad debe ser mayor a 0']
    },
    unitPrice: {
      type: Number,
      required: [true, 'El precio unitario es requerido'],
      min: [0.01, 'El precio unitario debe ser mayor a 0']
    },
    total: {
      type: Number,
      required: [true, 'El total del item es requerido']
    },
    satCode: {
      type: String,
      required: [true, 'El código SAT es requerido']
    }
  }],
  subtotal: {
    type: Number,
    required: [true, 'El subtotal es requerido'],
    min: [0, 'El subtotal no puede ser negativo']
  },
  tax: {
    type: Number,
    required: [true, 'El impuesto es requerido'],
    min: [0, 'El impuesto no puede ser negativo']
  },
  total: {
    type: Number,
    required: [true, 'El total es requerido'],
    min: [0.01, 'El total debe ser mayor a 0']
  },
  paymentMethod: {
    type: String,
    required: [true, 'El método de pago es requerido']
  },
  paymentForm: {
    type: String,
    required: [true, 'La forma de pago es requerida']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ 'cfdiData.uuid': 1 });
InvoiceSchema.index({ status: 1, dueDate: 1 });

// Métodos virtuales
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.status === 'pendiente' && new Date() > this.dueDate;
});

InvoiceSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const timeDiff = this.dueDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

InvoiceSchema.virtual('canBeFactored').get(function() {
  return this.status === 'pendiente' && 
         this.amount >= 1000 && 
         this.daysUntilDue > 1 &&
         !this.factoringData?.status;
});

// Métodos del schema
InvoiceSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.tax = this.subtotal * 0.16; // IVA 16%
  this.total = this.subtotal + this.tax;
  this.amount = this.total;
  return this;
};

InvoiceSchema.methods.generateInvoiceNumber = function() {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  this.invoiceNumber = `APX-${year}${month}-${random}`;
  return this;
};

InvoiceSchema.methods.requestFactoring = function(partnerId: string, partnerName: string) {
  if (!this.canBeFactored) {
    throw new Error('Esta factura no puede ser factorizada');
  }
  
  this.factoringData = {
    partnerId,
    partnerName,
    requestedAt: new Date(),
    anticipatedAmount: 0,
    feePercentage: 0,
    status: 'pendiente'
  };
  
  return this.save();
};

// Middleware pre-save
InvoiceSchema.pre('save', function(next) {
  // Auto-calcular totales si los items cambiaron
  if (this.isModified('items')) {
    this.calculateTotals();
  }
  
  // Generar número de factura si es nuevo
  if (this.isNew && !this.invoiceNumber) {
    this.generateInvoiceNumber();
  }
  
  // Actualizar status si está vencida
  if (this.status === 'pendiente' && new Date() > this.dueDate) {
    this.status = 'vencido';
  }
  
  next();
});

// Crear o retornar el modelo existente
const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default Invoice;
