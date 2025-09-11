import { makeExecutableSchema } from '@graphql-tools/schema';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import process from 'process';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';

import { createYoga } from 'graphql-yoga';
import { connectDB } from './config/db';

const app = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

// Middleware pour parser le JSON
app.use(express.json());

async function startServer() {
  await connectDB();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({
    schema: schema,
    context: ({ req, res }: { req: Request; res: Response }) => ({
      req,
      res,
    }),
  });

  app.all('/graphql', async (req, res) => {
    let body = '';

    if (req.method === 'POST') {
      body = JSON.stringify(req.body);
    }

    const response = await yoga.fetch(req.url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: body || undefined,
    });

    const responseText = await response.text();
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(responseText);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
