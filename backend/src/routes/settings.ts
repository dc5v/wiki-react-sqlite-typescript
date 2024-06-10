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
  const settings = await db.get('SELECT * FROM settings');
  res.json(settings);
});

router.post('/', authenticateToken, authorizePermission('canCreate'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { wikiName, styleFileName, canAnyoneRead, canAnyoneWrite, restrictedPaths } = req.body;
  const settingsId = await idGen();
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('INSERT INTO settings (id, wikiName, styleFileName, canAnyoneRead, canAnyoneWrite, restrictedPaths) VALUES (?, ?, ?, ?, ?, ?)', [settingsId, wikiName, styleFileName, canAnyoneRead, canAnyoneWrite, restrictedPaths]);
  res.status(201).json({ message: 'Settings created successfully' });
});

router.put('/:id', authenticateToken, authorizePermission('canEdit'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { id } = req.params;
  const { wikiName, styleFileName, canAnyoneRead, canAnyoneWrite, restrictedPaths } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });
  await db.run('UPDATE settings SET wikiName = ?, styleFileName = ?, canAnyoneRead = ?, canAnyoneWrite = ?, restrictedPaths = ? WHERE id = ?', [wikiName, styleFileName, canAnyoneRead, canAnyoneWrite, restrictedPaths, id]);
  res.json({ message: 'Settings updated successfully' });
});

export default router;
