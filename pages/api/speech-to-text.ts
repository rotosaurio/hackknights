import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongoose';
import UserData from '../../models/UserData';

type ResponseData = {
  text?: string;
  recipe?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const mongoose = await dbConnect();
    console.log('Conectado a MongoDB, buscando usuario...');
    
    // Verificar que tenemos una conexión válida
    if (!mongoose.connection || !mongoose.connection.db) {
      throw new Error('No se pudo establecer la conexión con la base de datos');
    }
    
    // Verificar la conexión
    console.log('Estado de la conexión:', mongoose.connection.readyState);
    console.log('Base de datos actual:', mongoose.connection.db.databaseName);
    
    // Intentar buscar directamente en la colección
    const db = mongoose.connection.db;
    const collection = db.collection('datosnodiab');
    const documentoDirecto = await collection.findOne({ user: 'pepe' });
    console.log('Documento encontrado directamente:', documentoDirecto);

    if (!documentoDirecto) {
      console.log('No se encontró el usuario pepe');
      return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
    }

    const { audioData } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'No se proporcionaron datos de audio' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const audioBuffer = Buffer.from(audioData, 'base64');
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
      language: 'es',
      response_format: 'text',
    });

    const prompt = `
    Basado en los siguientes datos del paciente:
    ${JSON.stringify(documentoDirecto)}
    
    Y considerando los siguientes ingredientes mencionados en esta transcripción:
    "${transcription}"
    
    Por favor:
    1. Extrae SOLO los ingredientes mencionados en la transcripción, ignorando cualquier otra información.
    2. Sugiere una receta saludable que:
       - Use estos ingredientes
       - Sea apropiada para las condiciones médicas del paciente
       - Incluya cantidades específicas
       - Incluya pasos de preparación
       - Incluya información nutricional
    `;

    console.log('Prompt enviado a OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-mini",
      temperature: 0.7,
    });

    const recipe = completion.choices[0].message.content || '';

    return res.status(200).json({ 
      text: transcription,
      recipe: recipe
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}
