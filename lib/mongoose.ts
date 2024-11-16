import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "tu_uri_de_mongodb";

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable de entorno MONGODB_URI');
}

async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    return await mongoose.connect(MONGODB_URI, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      retryWrites: true,
      w: "majority"
    });
    
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}

export default dbConnect;
