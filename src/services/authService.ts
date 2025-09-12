import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { IUser } from '../models/User';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
  city: string;
}

export class AuthService {
  static generateToken(user: IUser): string {
    const payload: AuthPayload = {
      userId: user._id?.toString() || '',
      email: user.email,
    };
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d',
    });
  }

  static verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as AuthPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}
