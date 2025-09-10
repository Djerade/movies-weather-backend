import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/movies_app',
  jwtSecret: process.env.JWT_SECRET || 'perfect',

};