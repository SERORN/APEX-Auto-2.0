import mongoose from "mongoose";

// Tipo para la conexión global de mongoose
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ No MongoDB URI found in environment variables.");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Mantener hasta 10 conexiones de socket
      serverSelectionTimeoutMS: 5000, // Mantener intentando de enviar operaciones por 5 segundos
      socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ Conectado exitosamente a MongoDB Atlas');
      return mongoose;
    });
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}

// Función de compatibilidad para el proyecto
export async function connectToDatabase() {
  const conn = await dbConnect();
  return { db: conn.db };
}

/**
 * Conecta a MongoDB Atlas usando Mongoose
 * Reutiliza la conexión existente para evitar múltiples conexiones
 */
export async function connectDB(): Promise<mongoose.Connection> {
  return await dbConnect();
}

/**
 * Desconecta de MongoDB (útil para testing o cierre limpio)
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Desconectado de MongoDB');
  }
}

/**
 * Verifica el estado de la conexión
 */
export function getConnectionStatus(): string {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
}

export default dbConnect;
