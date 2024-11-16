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
    
    const { email, password, name } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    const user = new User({
      email,
      password,
      name,
      isDiabetic: null
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET
    );

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isDiabetic: user.isDiabetic
      }
    });

  } catch (error) {
    console.error('Error en signup:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}