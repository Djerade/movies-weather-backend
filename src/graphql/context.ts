import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthService } from '../services/authService';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: {
    id: string;
    email: string;
    city: string;
  };
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext> {
  // Extraire le token d'authentification
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Enlever "Bearer "
    try {
      const payload = AuthService.verifyToken(token);
      // Récupérer les informations complètes de l'utilisateur
      const userData = await User.findById(payload.userId);
      if (userData) {
        user = {
          id: userData._id?.toString(),
          email: userData.email,
          city: userData.city,
        };
      }
    } catch (error) {
      // Token invalide, user reste null
      console.log('Invalid token:', error);
    }
  }

  return {
    req,
    res,
    user,
  };
}
