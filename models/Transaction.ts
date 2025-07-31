import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface ITransaction extends Document {
  _id: string;
  fromUser?: mongoose.Types.ObjectId;
  toUser?: mongoose.Types.ObjectId;
  amount: number;
  currency: 'MXN' | 'USD';
  type: 'pago' | 'cashback' | 'retiro' | 'compra' | 'deposito' | 'transferencia' | 'credito' | 'pago_credito';
  status: 'pendiente' | 'completado' | 'fallido' | 'cancelado';
  description: string;
  reference?: string;
  metadata?: {
    orderId?: string;
    invoiceId?: string;
    partnerId?: string;
    fees?: number;
    originalAmount?: number;
    exchangeRate?: number;
  };
  processedAt?: Date;
  failureReason?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const TransactionSchema: Schema<ITransaction> = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Permite transacciones del sistema (sin fromUser)
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Permite transacciones hacia el sistema (sin toUser)
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
  type: {
    type: String,
    enum: ['pago', 'cashback', 'retiro', 'compra', 'deposito', 'transferencia', 'credito', 'pago_credito'],
    required: [true, 'El tipo de transacción es requerido']
  },
  status: {
    type: String,
    enum: ['pendiente', 'completado', 'fallido', 'cancelado'],
    default: 'pendiente',
    required: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  reference: {
    type: String,
    sparse: true,
    index: true
  },
  metadata: {
    orderId: {
      type: String,
      sparse: true
    },
    invoiceId: {
      type: String,
      sparse: true
    },
    partnerId: {
      type: String,
      sparse: true
    },
    fees: {
      type: Number,
      min: [0, 'Las comisiones no pueden ser negativas']
    },
    originalAmount: {
      type: Number,
      min: [0, 'El monto original no puede ser negativo']
    },
    exchangeRate: {
      type: Number,
      min: [0, 'El tipo de cambio no puede ser negativo']
    }
  },
  processedAt: Date,
  failureReason: {
    type: String,
    maxlength: [200, 'La razón de falla no puede exceder 200 caracteres']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
TransactionSchema.index({ fromUser: 1, status: 1 });
TransactionSchema.index({ toUser: 1, status: 1 });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ date: -1 }); // Ordenamiento por fecha descendente
TransactionSchema.index({ reference: 1 });
TransactionSchema.index({ 'metadata.orderId': 1 });
TransactionSchema.index({ 'metadata.invoiceId': 1 });

// Métodos virtuales
TransactionSchema.virtual('isIncoming').get(function() {
  return this.toUser !== undefined;
});

TransactionSchema.virtual('isOutgoing').get(function() {
  return this.fromUser !== undefined;
});

TransactionSchema.virtual('netAmount').get(function() {
  const fees = this.metadata?.fees || 0;
  return this.amount - fees;
});

TransactionSchema.virtual('formattedAmount').get(function() {
  const symbol = this.currency === 'MXN' ? '$' : '$';
  return `${symbol}${this.amount.toFixed(2)} ${this.currency}`;
});

// Métodos del schema
TransactionSchema.methods.complete = function() {
  if (this.status !== 'pendiente') {
    throw new Error('Solo se pueden completar transacciones pendientes');
  }
  
  this.status = 'completado';
  this.processedAt = new Date();
  return this.save();
};

TransactionSchema.methods.fail = function(reason: string) {
  if (this.status !== 'pendiente') {
    throw new Error('Solo se pueden fallar transacciones pendientes');
  }
  
  this.status = 'fallido';
  this.failureReason = reason;
  this.processedAt = new Date();
  return this.save();
};

TransactionSchema.methods.cancel = function() {
  if (this.status === 'completado') {
    throw new Error('No se pueden cancelar transacciones completadas');
  }
  
  this.status = 'cancelado';
  this.processedAt = new Date();
  return this.save();
};

TransactionSchema.methods.generateReference = function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  
  this.reference = `APX${year}${month}${day}${random}`;
  return this;
};

// Métodos estáticos
TransactionSchema.statics.createPayment = function(
  fromUserId: string, 
  toUserId: string, 
  amount: number, 
  description: string,
  metadata: any = {}
) {
  const transaction = new this({
    fromUser: fromUserId,
    toUser: toUserId,
    amount,
    type: 'pago',
    description,
    metadata
  });
  
  transaction.generateReference();
  return transaction.save();
};

TransactionSchema.statics.createCashback = function(
  userId: string,
  amount: number,
  description: string,
  metadata: any = {}
) {
  const transaction = new this({
    toUser: userId,
    amount,
    type: 'cashback',
    description,
    metadata
  });
  
  transaction.generateReference();
  return transaction.save();
};

TransactionSchema.statics.createWithdrawal = function(
  userId: string,
  amount: number,
  description: string,
  metadata: any = {}
) {
  const transaction = new this({
    fromUser: userId,
    amount,
    type: 'retiro',
    description,
    metadata
  });
  
  transaction.generateReference();
  return transaction.save();
};

// Middleware pre-save
TransactionSchema.pre('save', function(next) {
  // Generar referencia si es nueva transacción y no tiene referencia
  if (this.isNew && !this.reference) {
    this.generateReference();
  }
  
  // Validar que al menos uno de fromUser o toUser esté presente
  if (!this.fromUser && !this.toUser) {
    throw new Error('La transacción debe tener al menos un usuario (origen o destino)');
  }
  
  // Validar que fromUser y toUser no sean el mismo
  if (this.fromUser && this.toUser && this.fromUser.toString() === this.toUser.toString()) {
    throw new Error('El usuario origen y destino no pueden ser el mismo');
  }
  
  next();
});

// Middleware post-save para actualizar wallets
TransactionSchema.post('save', async function(doc) {
  if (doc.status === 'completado' && doc.isModified('status')) {
    // Aquí se actualizarían los wallets automáticamente
    // Esta lógica se implementaría en los servicios
  }
});

// Crear o retornar el modelo existente
const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
