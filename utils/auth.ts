import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};