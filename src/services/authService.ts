import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import {config} from '../config/env'

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
      userId: (user._id as any).toString(),
      email: user.email,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d',
    });
  }

}
