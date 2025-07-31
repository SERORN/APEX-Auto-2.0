import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface ICreditLine extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  maxAmount: number;
  usedAmount: number;
  currency: 'MXN' | 'USD';
  status: 'activa' | 'suspendida' | 'cancelada' | 'pendiente_aprobacion';
  partner: 'kueski' | 'konfio' | 'credijusto' | 'apex_internal';
  interestRate: number;
  paymentTerms: number; // días
  approvedAt?: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  approvalData?: {
    creditScore: number;
    monthlyIncome: number;
    debtToIncomeRatio: number;
    approvedBy: string;
    conditions: string[];
  };
  paymentHistory: Array<{
    amount: number;
    date: Date;
    status: 'pagado' | 'vencido' | 'pendiente';
    dueDate: Date;
    transactionId?: mongoose.Types.ObjectId;
  }>;
  fees: {
    originationFee: number;
    lateFee: number;
    prepaymentFee: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const CreditLineSchema: Schema<ICreditLine> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido'],
    index: true
  },
  maxAmount: {
    type: Number,
    required: [true, 'El monto máximo es requerido'],
    min: [1000, 'El monto mínimo de línea de crédito es $1,000']
  },
  usedAmount: {
    type: Number,
    default: 0,
    min: [0, 'El monto usado no puede ser negativo']
  },
  currency: {
    type: String,
    enum: ['MXN', 'USD'],
    default: 'MXN'
  },
  status: {
    type: String,
    enum: ['activa', 'suspendida', 'cancelada', 'pendiente_aprobacion'],
    default: 'pendiente_aprobacion',
    required: true
  },
  partner: {
    type: String,
    enum: ['kueski', 'konfio', 'credijusto', 'apex_internal'],
    required: [true, 'El socio financiero es requerido']
  },
  interestRate: {
    type: Number,
    required: [true, 'La tasa de interés es requerida'],
    min: [0, 'La tasa de interés no puede ser negativa'],
    max: [100, 'La tasa de interés no puede exceder 100%']
  },
  paymentTerms: {
    type: Number,
    required: [true, 'Los términos de pago son requeridos'],
    min: [1, 'Los términos de pago deben ser al menos 1 día'],
    max: [365, 'Los términos de pago no pueden exceder 365 días']
  },
  approvedAt: Date,
  expiresAt: Date,
  lastUsedAt: Date,
  approvalData: {
    creditScore: {
      type: Number,
      min: [300, 'Score mínimo es 300'],
      max: [850, 'Score máximo es 850']
    },
    monthlyIncome: {
      type: Number,
      min: [0, 'El ingreso mensual no puede ser negativo']
    },
    debtToIncomeRatio: {
      type: Number,
      min: [0, 'La relación deuda-ingreso no puede ser negativa'],
      max: [100, 'La relación deuda-ingreso no puede exceder 100%']
    },
    approvedBy: String,
    conditions: [String]
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'El monto del pago debe ser mayor a 0']
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pagado', 'vencido', 'pendiente'],
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  }],
  fees: {
    originationFee: {
      type: Number,
      default: 0,
      min: [0, 'La comisión de originación no puede ser negativa']
    },
    lateFee: {
      type: Number,
      default: 0,
      min: [0, 'La comisión por mora no puede ser negativa']
    },
    prepaymentFee: {
      type: Number,
      default: 0,
      min: [0, 'La comisión por pago anticipado no puede ser negativa']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
CreditLineSchema.index({ userId: 1, status: 1 });
CreditLineSchema.index({ partner: 1, status: 1 });
CreditLineSchema.index({ expiresAt: 1 });
CreditLineSchema.index({ status: 1, approvedAt: 1 });

// Métodos virtuales
CreditLineSchema.virtual('availableAmount').get(function() {
  if (this.status !== 'activa') return 0;
  return Math.max(0, this.maxAmount - this.usedAmount);
});

CreditLineSchema.virtual('utilizationRate').get(function() {
  if (this.maxAmount === 0) return 0;
  return (this.usedAmount / this.maxAmount) * 100;
});

CreditLineSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

CreditLineSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const timeDiff = this.expiresAt.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

CreditLineSchema.virtual('outstandingBalance').get(function() {
  return this.paymentHistory
    .filter(payment => payment.status === 'pendiente' || payment.status === 'vencido')
    .reduce((total, payment) => total + payment.amount, 0);
});

// Métodos del schema
CreditLineSchema.methods.approve = function(approvalData: any) {
  this.status = 'activa';
  this.approvedAt = new Date();
  this.approvalData = approvalData;
  
  // Establecer fecha de expiración (1 año por defecto)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  this.expiresAt = expiryDate;
  
  return this.save();
};

CreditLineSchema.methods.suspend = function(reason = 'Suspendido por sistema') {
  if (this.status === 'cancelada') {
    throw new Error('No se puede suspender una línea de crédito cancelada');
  }
  
  this.status = 'suspendida';
  return this.save();
};

CreditLineSchema.methods.cancel = function() {
  if (this.usedAmount > 0) {
    throw new Error('No se puede cancelar una línea de crédito con saldo pendiente');
  }
  
  this.status = 'cancelada';
  this.isActive = false;
  return this.save();
};

CreditLineSchema.methods.useCredit = function(amount: number) {
  if (this.status !== 'activa') {
    throw new Error('La línea de crédito no está activa');
  }
  
  if (this.isExpired) {
    throw new Error('La línea de crédito ha expirado');
  }
  
  if (amount > this.availableAmount) {
    throw new Error('Monto excede el crédito disponible');
  }
  
  this.usedAmount += amount;
  this.lastUsedAt = new Date();
  
  // Agregar pago pendiente
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + this.paymentTerms);
  
  this.paymentHistory.push({
    amount: amount + (amount * this.interestRate / 100),
    date: new Date(),
    status: 'pendiente',
    dueDate
  });
  
  return this.save();
};

CreditLineSchema.methods.makePayment = function(amount: number, transactionId?: string) {
  if (amount <= 0) {
    throw new Error('El monto del pago debe ser mayor a 0');
  }
  
  // Encontrar pagos pendientes ordenados por fecha de vencimiento
  const pendingPayments = this.paymentHistory
    .filter(payment => payment.status === 'pendiente' || payment.status === 'vencido')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  let remainingAmount = amount;
  
  for (const payment of pendingPayments) {
    if (remainingAmount <= 0) break;
    
    if (remainingAmount >= payment.amount) {
      // Pago completo
      remainingAmount -= payment.amount;
      this.usedAmount -= payment.amount;
      payment.status = 'pagado';
      if (transactionId) {
        payment.transactionId = new mongoose.Types.ObjectId(transactionId);
      }
    } else {
      // Pago parcial
      payment.amount -= remainingAmount;
      this.usedAmount -= remainingAmount;
      remainingAmount = 0;
    }
  }
  
  return this.save();
};

CreditLineSchema.methods.calculateMonthlyPayment = function() {
  if (this.usedAmount === 0) return 0;
  
  const monthlyRate = this.interestRate / 100 / 12;
  const months = this.paymentTerms / 30; // Convertir días a meses aproximados
  
  if (monthlyRate === 0) {
    return this.usedAmount / months;
  }
  
  const payment = this.usedAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment * 100) / 100;
};

// Middleware pre-save
CreditLineSchema.pre('save', function(next) {
  // Validar que usedAmount no exceda maxAmount
  if (this.usedAmount > this.maxAmount) {
    throw new Error('El monto usado no puede exceder el límite máximo');
  }
  
  // Actualizar status si está expirada
  if (this.expiresAt && new Date() > this.expiresAt && this.status === 'activa') {
    this.status = 'suspendida';
  }
  
  // Actualizar pagos vencidos
  const now = new Date();
  this.paymentHistory.forEach(payment => {
    if (payment.status === 'pendiente' && now > payment.dueDate) {
      payment.status = 'vencido';
    }
  });
  
  next();
});

// Crear o retornar el modelo existente
const CreditLine: Model<ICreditLine> = mongoose.models.CreditLine || mongoose.model<ICreditLine>('CreditLine', CreditLineSchema);

export default CreditLine;
