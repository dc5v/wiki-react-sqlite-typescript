import express, { Request, Response } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { authenticateToken, authorizePermission } from '../auth';
import { idGen } from '../utils/idGen';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.get('/', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  const users = await db.all('SELECT * FROM users');
  res.json(users);
});

router.post('/', authenticateToken, authorizePermission('canCreate'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { email, provider, joined, group_id } = req.body;
  const userId = await idGen();
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('INSERT INTO users (id, email, provider, joined, group_id) VALUES (?, ?, ?, ?, ?)', [userId, email, provider, joined, group_id]);
  res.status(201).json({ message: 'User created successfully' });
});

router.get('/:id', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  res.json(user);
});

router.put('/:id', authenticateToken, authorizePermission('canEdit'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const { memo, group_id, canView, canEdit, canDelete, canCreate, isBanned } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('UPDATE users SET memo = ?, group_id = ?, canView = ?, canEdit = ?, canDelete = ?, canCreate = ?, isBanned = ? WHERE id = ?', [memo, group_id, canView, canEdit, canDelete, canCreate, isBanned, id]);
  res.json({ message: 'User updated successfully' });
});

export default router;
