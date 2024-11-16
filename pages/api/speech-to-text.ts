import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongoose';
import { DiabetesQuizResponse, NonDiabetesQuizResponse } from '../../models/QuizResponse';

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
    console.log('Método no permitido:', req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('Datos recibidos:', req.body);
    await dbConnect();
    
    const { audioData, userName } = req.body;
    if (!audioData || !userName) {
      console.log('Faltan datos requeridos:', { audioData, userName });
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Buscar las respuestas del usuario en ambas colecciones
    const diabetesResponse = await DiabetesQuizResponse.findOne({ userName });
    const nonDiabetesResponse = await NonDiabetesQuizResponse.findOne({ userName });

    let userResponses;
    let isDiabetic;

    if (diabetesResponse) {
      userResponses = diabetesResponse.responses;
      isDiabetic = true;
    } else if (nonDiabetesResponse) {
      userResponses = nonDiabetesResponse.responses;
      isDiabetic = false;
    } else {
      console.log('No se encontraron respuestas del usuario:', userName);
      return res.status(404).json({ error: 'No se encontraron respuestas del usuario' });
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

    console.log('Transcripción obtenida:', transcription);

    const prompt = `
    Actúa como un nutricionista experto. Basándote en el siguiente perfil de usuario:
    ${isDiabetic ? 'PACIENTE CON DIABETES' : 'PACIENTE EN PREVENCIÓN DE DIABETES'}
    
    Datos del paciente:
    - Edad: ${userResponses.edad}
    - Altura: ${userResponses.altura}
    - Peso: ${userResponses.peso}
    - Nivel de actividad: ${userResponses.nivel_actividad}
    - Restricciones dietéticas: ${userResponses.restricciones_dieteticas || 'Ninguna'}
    - Alergias: ${userResponses.alergias || 'Ninguna'}
    - Patrones de comida: ${userResponses.patrones_comida}
    ${isDiabetic ? `- Medicamentos: ${userResponses.medicamentos}` : ''}
    
    El usuario ha mencionado los siguientes ingredientes en su consulta:
    "${transcription}"
    
    Por favor, genera una receta saludable que:
    1. Use ÚNICAMENTE los ingredientes mencionados por el usuario, sin agregar ingredientes adicionales
    2. Sea segura para su perfil médico
    3. Incluya:
       - Lista de ingredientes con cantidades
       - Pasos de preparación
       - Información nutricional
       - Recomendaciones específicas basadas en su perfil
    
    IMPORTANTE: No agregues ingredientes que el usuario no haya mencionado.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    const recipe = completion.choices[0].message.content || '';
    console.log('Receta generada:', recipe);

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
