import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://edgarafedo123:baj4aLEtp3UC0yZN@serverlessinstance0.5metinr.mongodb.net/hackathon";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function dbConnect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Usando conexión existente');
      return mongoose;
    }
    
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado exitosamente');
    
    return mongoose;
    
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}

export default dbConnect;
