import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongoose';
import DiabetesEntry from '../../models/DiabetesEntry';
import { verifyToken } from '../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  if (req.method === 'GET') {
    try {
      const entries = await DiabetesEntry.find({ userId: decoded.userId })
        .sort({ fecha: -1 });
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las entradas' });
    }
  } else if (req.method === 'POST') {
    try {
      const entry = new DiabetesEntry({
        ...req.body,
        userId: decoded.userId
      });
      await entry.save();
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Error al guardar la entrada' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}