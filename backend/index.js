import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import resourcesRoutes from './routes/resources.routes.js';
import configRoutes from './routes/config.routes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import LMSRoutes from './routes/lms.routes.js';
import userRoutes from './routes/user.routes.js';
import lectureRoutes from './routes/lectures.routes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) =>
  res.json({ message: 'Welcome to the engi-smart-study backend API!' })
);

app.use('/api', authRoutes);
app.use('/api', resourcesRoutes);
app.use('/api', configRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/lms', LMSRoutes);
app.use('/api/user', userRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/files', express.static(path.join(__dirname, 'backend/public/files')));
app.use('/files', express.static(path.join(__dirname, 'public/files')));
app.get('/scholarship/download', (req, res) => {
  const filePath = path.join(__dirname, 'backend/public/files/Scholarship.pdf');
  res.download(filePath, 'Scholarship.pdf');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
