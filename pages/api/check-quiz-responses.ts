import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongoose';
import { DiabetesQuizResponse, NonDiabetesQuizResponse } from '../../models/QuizResponse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await dbConnect();
    const { userName } = req.query;

    const diabetesResponse = await DiabetesQuizResponse.findOne({ userName });
    const nonDiabetesResponse = await NonDiabetesQuizResponse.findOne({ userName });

    const hasResponses = diabetesResponse || nonDiabetesResponse;
    
    res.status(200).json({ 
      hasResponses,
      isDiabetic: diabetesResponse ? true : false,
      hasQuiz: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar respuestas' });
  }
}