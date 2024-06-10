import express, { Request, Response } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { generateToken, hashPassword, comparePassword } from '../auth';
import { idGen } from '../utils/idGen';
import { AuthenticatedRequest } from '../utils/types';
import 'dotenv/config';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) =>
{
  const { email, password, provider } = req.body;
  const hashedPassword = await hashPassword(password);
  const userId = await idGen();
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  await db.run('INSERT INTO users (id, email, provider, password, joined) VALUES (?, ?, ?, ?, ?)', [userId, email, provider, hashedPassword, new Date().toISOString()]);
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req: Request, res: Response) =>
{
  const { email, password } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !(await comparePassword(password, user.password)))
  {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.json({ token });
});

export default router;
