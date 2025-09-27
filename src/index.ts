import { makeExecutableSchema } from '@graphql-tools/schema';
import 'dotenv/config';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import process from 'process';
import { connectDB } from './config/db';
import { createContext } from './graphql/context';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import { corsConfig } from './middleware/cors';

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {
  await connectDB();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({
    schema: schema,
    cors: corsConfig,
    context: async ({ request }: { request: any }) => {
      // Convertir la Request Web API en objet Express-like
      const req = {
        headers: {
          authorization: request.headers.get('authorization'),
        },
        method: request.method,
        url: request.url,
        body: request.body,
      } as any;

      const res = {} as any;

      return await createContext({ req, res });
    },
  });

  const server = createServer(yoga);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
