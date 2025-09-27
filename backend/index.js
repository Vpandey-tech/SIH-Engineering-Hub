
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import configRoutes from './routes/config.routes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,        
}));
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get('/', (req, res) => res.json({ message: 'Welcome to the engi-smart-study backend API!' }));

app.use('/api', authRoutes);
app.use('/api', resourcesRoutes);
app.use('/api', configRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/files', express.static(path.join(__dirname, 'backend/public/files')));
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.get('/scholarship/download', (req, res) => {
  const filePath = path.join(__dirname, 'backend/public/files/Scholarship.pdf');
  res.download(filePath, 'Scholarship.pdf');
});
// Security and optimization middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));

// CORS configuration for screen sharing
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (for scholarship PDF, etc.)
app.use('/files', express.static(path.join(__dirname, 'public/files')));

// API routes
app.use('/api/gemini', geminiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Engineering Hub API Server Running',
    features: ['Screen Sharing', 'Voice Analysis', 'Multi-file Upload'],
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Engineering Hub Server running on port ${PORT}`);
  console.log(`📱 Screen sharing enabled`);
  console.log(`🎤 Voice analysis ready`);
});