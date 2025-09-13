import { makeExecutableSchema } from '@graphql-tools/schema';
import 'dotenv/config';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import process from 'process';
import { connectDB } from './config/db';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import { User } from './models/User';
import { AuthService } from './services/authService';

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {
  await connectDB();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({
    schema: schema,
    context: async ({ request }: { request: any }) => {
      // Extraire les en-têtes de la requête Web API
      const authHeader = request.headers.get('authorization');
      let user = null;

      console.log('=== CONTEXT CREATION ===');
      console.log(
        'Authorization header:',
        authHeader ? '[PRESENT]' : '[MISSING]'
      );

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('Token extracted:', token ? '[PRESENT]' : '[MISSING]');
        console.log('Token length:', token?.length || 0);

        try {
          const payload = AuthService.verifyToken(token);
          console.log('✅ Token verified successfully');
          console.log('Payload userId:', payload.userId);

          const userData = await User.findById(payload.userId);
          if (userData) {
            user = {
              id: userData._id?.toString(),
              email: userData.email,
              city: userData.city,
            };
            console.log('✅ User context created:', user.email, user.city);
          } else {
            console.log('❌ User not found in database');
          }
        } catch (error) {
          console.log('❌ Invalid token:', error);
        }
      } else {
        console.log('❌ No Bearer token found');
      }

      return {
        req: {} as any,
        res: {} as any,
        user,
      };
    },
  });

  const server = createServer(yoga);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
