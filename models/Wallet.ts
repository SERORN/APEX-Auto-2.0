import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface IWallet extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  balance: number;
  cashbackAvailable: number;
  transactions: mongoose.Types.ObjectId[];
  lastUpdated: Date;
  currency: 'MXN' | 'USD';
  frozenBalance: number;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const WalletSchema: Schema<IWallet> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido'],
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'El balance no puede ser negativo']
  },
  cashbackAvailable: {
    type: Number,
    default: 0,
    min: [0, 'El cashback disponible no puede ser negativo']
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  currency: {
    type: String,
    enum: ['MXN', 'USD'],
    default: 'MXN'
  },
  frozenBalance: {
    type: Number,
    default: 0,
    min: [0, 'El balance congelado no puede ser negativo']
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: [0, 'El límite de crédito no puede ser negativo']
  },
  usedCredit: {
    type: Number,
    default: 0,
    min: [0, 'El crédito usado no puede ser negativo']
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
WalletSchema.index({ userId: 1 });
WalletSchema.index({ isActive: 1 });
WalletSchema.index({ lastUpdated: 1 });

// Métodos virtuales
WalletSchema.virtual('availableCredit').get(function() {
  return Math.max(0, this.creditLimit - this.usedCredit);
});

WalletSchema.virtual('totalAvailable').get(function() {
  return this.balance + this.cashbackAvailable + this.availableCredit;
});

WalletSchema.virtual('availableBalance').get(function() {
  return Math.max(0, this.balance - this.frozenBalance);
});

// Métodos del schema
WalletSchema.methods.addBalance = function(amount: number, source = 'manual') {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  this.balance += amount;
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.deductBalance = function(amount: number, allowNegative = false) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (!allowNegative && (this.balance - this.frozenBalance) < amount) {
    throw new Error('Saldo insuficiente');
  }
  
  this.balance -= amount;
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.addCashback = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto de cashback debe ser mayor a 0');
  }
  
  this.cashbackAvailable += amount;
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.useCashback = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (this.cashbackAvailable < amount) {
    throw new Error('Cashback insuficiente');
  }
  
  this.cashbackAvailable -= amount;
  this.balance += amount; // El cashback se convierte en balance disponible
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.freezeBalance = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (this.balance < amount) {
    throw new Error('Saldo insuficiente para congelar');
  }
  
  this.frozenBalance += amount;
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.unfreezeBalance = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (this.frozenBalance < amount) {
    throw new Error('No hay suficiente balance congelado');
  }
  
  this.frozenBalance -= amount;
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.useCredit = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (this.availableCredit < amount) {
    throw new Error('Límite de crédito insuficiente');
  }
  
  this.usedCredit += amount;
  this.balance += amount; // El crédito se agrega al balance
  this.lastUpdated = new Date();
  return this.save();
};

WalletSchema.methods.payCredit = function(amount: number) {
  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
  
  if (this.balance < amount) {
    throw new Error('Saldo insuficiente para pagar crédito');
  }
  
  const paymentAmount = Math.min(amount, this.usedCredit);
  
  this.balance -= paymentAmount;
  this.usedCredit -= paymentAmount;
  this.lastUpdated = new Date();
  
  return this.save();
};

WalletSchema.methods.setCreditLimit = function(newLimit: number) {
  if (newLimit < 0) {
    throw new Error('El límite de crédito no puede ser negativo');
  }
  
  if (newLimit < this.usedCredit) {
    throw new Error('El nuevo límite no puede ser menor al crédito usado');
  }
  
  this.creditLimit = newLimit;
  this.lastUpdated = new Date();
  return this.save();
};

// Middleware pre-save
WalletSchema.pre('save', function(next) {
  // Actualizar lastUpdated en cada cambio
  this.lastUpdated = new Date();
  
  // Validar que el balance congelado no exceda el balance total
  if (this.frozenBalance > this.balance) {
    this.frozenBalance = this.balance;
  }
  
  // Validar que el crédito usado no exceda el límite
  if (this.usedCredit > this.creditLimit) {
    throw new Error('El crédito usado no puede exceder el límite');
  }
  
  next();
});

// Crear o retornar el modelo existente
const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;
