import mongoose from 'mongoose';

// Definir la interfaz para el objeto cached
interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extender el tipo global para incluir mongoose
declare global {
  var mongoose: Cached | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable de entorno MONGODB_URI');
}

// Inicializar el objeto cached con el tipo correcto
const cached: Cached = (global as any).mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Usando conexión existente a MongoDB');
    return cached.conn;
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5
    } as mongoose.ConnectOptions;

    console.log('Conectando a MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts);
    cached.conn = await cached.promise;
    console.log('Conectado exitosamente a MongoDB');
    
    // Manejador de errores de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error en la conexión de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
      cached.conn = null;
      cached.promise = null;
    });

    return cached.conn;
  } catch (e) {
    console.error('Error al conectar con MongoDB:', e);
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;
