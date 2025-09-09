import 'dotenv/config';
import express, { Request, Response } from 'express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import process from 'process';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { connectDB } from './config/db';
import { createYoga } from 'graphql-yoga';

const app = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {

  await connectDB();



  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = createYoga({
    schema: schema,
  });

  app.use('/graphql', server);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();