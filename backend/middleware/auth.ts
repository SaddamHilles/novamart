import type { NextFunction, Request, Response } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { User, type UserDocument } from '../models/User';

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: 'Please sign in to continue' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret()) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Account no longer exists' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired. Please sign in again' });
  }
}

export function admin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
}

export function signToken(userId: string) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id: userId }, jwtSecret(), options);
}

export function requireUser(req: Request): UserDocument {
  if (!req.user) {
    throw new Error('Authenticated user missing from request');
  }
  return req.user as UserDocument;
}
