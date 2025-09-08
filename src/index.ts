import 'dotenv/config';
import express, { Request, Response } from 'express';
import process from 'process';

const app = express();
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Movies Weather Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      movies: '/api/movies',
      weather: '/api/weather',
    },
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Movies Weather Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'API is working!',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api',
      'GET /api/movies',
      'GET /api/weather',
    ],
  });
});

// Movies routes
app.get('/api/movies', (req: Request, res: Response) => {
  res.json({
    message: 'Movies endpoint - Coming soon!',
    data: [],
  });
});

// Weather routes
app.get('/api/weather', (req: Request, res: Response) => {
  res.json({
    message: 'Weather endpoint - Coming soon!',
    data: [],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API available at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
