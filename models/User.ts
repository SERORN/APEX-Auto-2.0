import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  role: 'cliente' | 'distribuidor' | 'proveedor' | 'fintech_admin';
  kycCompleted: boolean;
  walletBalance: number;
  creditScore: number;
  registeredAt: Date;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessInfo?: {
    companyName: string;
    rfc: string;
    industry: string;
  };
  isActive: boolean;
  lastLogin?: Date;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Mongoose
const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  role: {
    type: String,
    enum: ['cliente', 'distribuidor', 'proveedor', 'fintech_admin'],
    required: [true, 'El rol es requerido'],
    default: 'cliente'
  },
  kycCompleted: {
    type: Boolean,
    default: false
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: [0, 'El balance no puede ser negativo']
  },
  creditScore: {
    type: Number,
    default: 650,
    min: [300, 'Score mínimo es 300'],
    max: [850, 'Score máximo es 850']
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'México' }
  },
  businessInfo: {
    companyName: String,
    rfc: {
      type: String,
      uppercase: true,
      trim: true,
      match: [/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'Formato de RFC inválido']
    },
    industry: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ kycCompleted: 1 });
UserSchema.index({ creditScore: 1 });

// Métodos virtuales
UserSchema.virtual('fullBusinessName').get(function() {
  if (this.businessInfo?.companyName) {
    return this.businessInfo.companyName;
  }
  return this.name;
});

UserSchema.virtual('canRequestCredit').get(function() {
  return this.kycCompleted && this.creditScore >= 600 && this.isActive;
});

// Métodos del schema
UserSchema.methods.updateCreditScore = function(newScore: number) {
  if (newScore >= 300 && newScore <= 850) {
    this.creditScore = newScore;
    return this.save();
  }
  throw new Error('Score de crédito inválido');
};

UserSchema.methods.completeKYC = function() {
  this.kycCompleted = true;
  this.emailVerified = true;
  return this.save();
};

// Middleware pre-save
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    // Lógica adicional cuando se actualiza lastLogin
  }
  next();
});

// Prevenir duplicados por email
UserSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ 
      email: this.email, 
      _id: { $ne: this._id } 
    });
    
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
  }
  next();
});

// Crear o retornar el modelo existente
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
