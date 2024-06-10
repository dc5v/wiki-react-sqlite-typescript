import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDB } from './db';
import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
import logRoutes from './routes/logs';
import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import docRoutes from './routes/docs';
import settingsRoutes from './routes/settings';
import 'dotenv/config';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/settings', settingsRoutes);

initializeDB().then(() =>
{
  app.listen(port, () =>
  {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
