import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await dbConnect();
    
    const { email, password } = req.body;

    // Buscar usuario con contraseña sin encriptar
    const user = await User.findOne({ 
      email: email,
      password: password // Comparación directa de contraseñas
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET
    );

    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isDiabetic: user.isDiabetic
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}