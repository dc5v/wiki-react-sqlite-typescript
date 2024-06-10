import express, { Request, Response } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { authenticateToken, authorizePermission } from '../auth';
import 'dotenv/config';

const router = express.Router();

router.get('/', authenticateToken, authorizePermission('canView'), async (req: Request, res: Response) =>
{
  const { search, column, pageSize, page } = req.query;
  const offset = (parseInt(page as string, 10) - 1) * parseInt(pageSize as string, 10);
  const searchQuery = search ? `WHERE ${column} LIKE '%${search}%'` : '';
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  const logs = await db.all(`SELECT * FROM logs ${searchQuery} LIMIT ? OFFSET ?`, [pageSize, offset]);
  res.json(logs);
});

router.get('/user/:uid', authenticateToken, authorizePermission('canView'), async (req: Request, res: Response) =>
{
  const { uid } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  const logs = await db.all('SELECT * FROM logs WHERE user_id = ?', [uid]);
  res.json(logs);
});

export default router;
