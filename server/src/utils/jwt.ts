import jwt from 'jsonwebtoken';

const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key') as string;

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  teamId?: string | null;
}

export const generateToken = (payload: TokenPayload, expiresIn = '7d'): string => {
  const options: any = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options) as string;
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1] || null;
};
