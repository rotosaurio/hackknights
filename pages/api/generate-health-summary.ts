import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongoose';
import { DiabetesQuizResponse, NonDiabetesQuizResponse } from '../../models/QuizResponse';
import DiabetesEntrySchema from '../../models/DiabetesEntry';
import { verifyToken } from '../../utils/auth';

type ResponseData = {
  summary?: string;
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
    await dbConnect();
    
    // Verificar token y obtener userId
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { userName } = req.body;

    // Obtener respuestas del cuestionario
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
      return res.status(404).json({ error: 'No se encontraron respuestas del usuario' });
    }

    // Obtener entradas de la bitácora usando userId
    const entries = await DiabetesEntrySchema.find({ userId: decoded.userId })
      .sort({ fecha: -1 })
      .limit(30); // Limitamos a los últimos 30 registros para el resumen

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

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
    
    Historial de registros (últimos ${entries.length} registros):
    ${entries.map(entry => `
    Fecha: ${entry.fecha}
    - Glucosa: ${entry.glucosa} mg/dL
    - Insulina: ${entry.insulina} UI
    - Medicamentos: ${entry.medicamentos}
    - Nivel de Actividad: ${entry.nivelActividad}
    - Comidas por día: ${entry.comidasPorDia}
    - Desafíos: ${entry.desafios}
    `).join('\n')}

    Por favor, genera un resumen médico detallado que incluya:
    1. Estado general de salud
    2. Tendencias en los niveles de glucosa e insulina
    3. Evaluación del manejo de la diabetes o riesgo de diabetes
    4. Recomendaciones específicas para mejorar
    5. Áreas de preocupación o atención especial
    6. Progreso y logros notables
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;
    if (!summary) {
      return res.status(500).json({ error: 'No se pudo generar el resumen' });
    }

    return res.status(200).json({ summary });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}