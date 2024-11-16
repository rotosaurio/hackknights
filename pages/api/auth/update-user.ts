import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';
import { verifyToken } from '../../../utils/auth';

type ResponseData = {
  message?: string;
  error?: string;
  user?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'PUT') {
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
    
    const { userName, isDiabetic } = req.body;
    console.log('Recibido:', { userName, isDiabetic });

    if (!userName || typeof isDiabetic !== 'boolean') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const user = await User.findOneAndUpdate(
      { name: userName },
      { $set: { isDiabetic } },
      { new: true }
    );

    if (!user) {
      console.error('Usuario no encontrado:', userName);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario actualizado:', user);

    res.status(200).json({ 
      message: 'Usuario actualizado exitosamente',
      user: {
        name: user.name,
        email: user.email,
        isDiabetic: user.isDiabetic
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}
