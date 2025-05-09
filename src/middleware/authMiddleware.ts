import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlackList.model';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const  authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  console.log('>>> token :', token);
  try {
    const blacklisted = await TokenBlacklist.findOne({ token });
    console.log('>>> blackListed :', blacklisted);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token revoked' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    console.log('>>> decoded :', decoded);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error('>>> Error in Middleware :', error);
    res.status(401).json({ message: error });
  }
};