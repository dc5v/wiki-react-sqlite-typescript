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
  const groups = await db.all('SELECT * FROM groups');
  res.json(groups);
});

router.post('/', authenticateToken, authorizePermission('canCreate'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { name, createdAt, canView, canEdit, canDelete, canCreate } = req.body;
  const groupId = await idGen();
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('INSERT INTO groups (id, name, createdAt, canView, canEdit, canDelete, canCreate) VALUES (?, ?, ?, ?, ?, ?, ?)', [groupId, name, createdAt, canView, canEdit, canDelete, canCreate]);
  res.status(201).json({ message: 'Group created successfully' });
});

router.get('/:id', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  const group = await db.get('SELECT * FROM groups WHERE id = ?', [id]);
  res.json(group);
});

router.put('/:id', authenticateToken, authorizePermission('canEdit'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const { name, canView, canEdit, canDelete, canCreate } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('UPDATE groups SET name = ?, canView = ?, canEdit = ?, canDelete = ?, canCreate = ? WHERE id = ?', [name, canView, canEdit, canDelete, canCreate, id]);
  res.json({ message: 'Group updated successfully' });
});

router.delete('/:id', authenticateToken, authorizePermission('canDelete'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('DELETE FROM groups WHERE id = ?', [id]);
  res.json({ message: 'Group deleted successfully' });
});

export default router;
