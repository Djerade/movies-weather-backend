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

export async function createContext(context: any): Promise<GraphQLContext> {
  const { req, res } = context;

  // Vérifier que req existe
  if (!req) {
    console.log('❌ No request object, returning empty context');
    return {
      req: {} as Request,
      res: {} as Response,
      user: null,
    };
  }

  // Extraire le token d'authentification
  const authHeader = req.headers?.authorization;
  console.log('Authorization header:', authHeader ? '[PRESENT]' : '[MISSING]');
  console.log('Authorization header value:', authHeader);

  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Enlever "Bearer "
    console.log('Token extracted:', token ? '[PRESENT]' : '[MISSING]');
    console.log('Token length:', token?.length || 0);

    try {
      const payload = AuthService.verifyToken(token);
      console.log('✅ Token verified successfully');
      console.log('Payload userId:', payload.userId);

      // Récupérer les informations complètes de l'utilisateur
      const userData = await User.findById(payload.userId);
      console.log('User data from DB:', userData ? 'Found' : 'Not found');
      if (userData) {
        user = {
          id: userData._id?.toString(),
          email: userData.email,
          city: userData.city,
        };
        console.log('✅ User context created:', user.email, user.city);
      } else {
        console.log(
          '❌ User not found in database for userId:',
          payload.userId
        );
      }
    } catch (error) {
      // Token invalide, user reste null
      console.log('❌ Invalid token:', error);
    }
  } else {
    console.log('❌ No Bearer token found in authorization header');
  }

  return {
    req,
    res,
    user,
  };
}
