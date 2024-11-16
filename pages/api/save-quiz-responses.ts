import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongoose';
import { DiabetesQuizResponse, NonDiabetesQuizResponse } from '../../models/QuizResponse';
import { verifyToken } from '../../utils/auth';

type ResponseData = {
  message?: string;
  error?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    await dbConnect();
    
    const { responses, isDiabetic, userName } = req.body;

    if (!responses || typeof isDiabetic !== 'boolean' || !userName) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const QuizModel = isDiabetic ? DiabetesQuizResponse : NonDiabetesQuizResponse;
    
    const existingDiabetic = await DiabetesQuizResponse.findOne({ userName });
    const existingNonDiabetic = await NonDiabetesQuizResponse.findOne({ userName });

    if (existingDiabetic || existingNonDiabetic) {
      return res.status(400).json({ error: 'Ya has respondido un cuestionario' });
    }

    const quizResponse = new QuizModel({
      userName,
      responses,
      isDiabetic,
      createdAt: new Date()
    });

    console.log('Guardando respuesta en colección:', isDiabetic ? 'DiabetesQuizResponse' : 'NonDiabetesQuizResponse');
    const result = await quizResponse.save();

    res.status(201).json({
      message: 'Respuestas guardadas exitosamente',
      data: result
    });

  } catch (error) {
    console.error('Error al guardar las respuestas:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    });
  }
}