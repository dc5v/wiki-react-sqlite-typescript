import express, { Request, Response } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { authenticateToken, authorizePermission } from '../auth';
import { idGen } from '../utils/idGen';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

router.get('/:docId/:version?', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { docId, version } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  let query = 'SELECT * FROM documents_history WHERE document_id = ?';
  const params: any[] = [docId];
  if (version)
  {
    query += ' AND version = ?';
    params.push(version);
  } else
  {
    query += ' ORDER BY version DESC LIMIT 1';
  }

  const doc = await db.get(query, params);
  res.json(doc);
});

router.get('/path/:path/:name', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { path, name } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  const doc = await db.get('SELECT * FROM documents_history WHERE path = ? AND name = ? ORDER BY version DESC LIMIT 1', [path, name]);
  res.json(doc);
});

router.post('/', authenticateToken, authorizePermission('canCreate'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { path, name, content } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  let docName = name;
  let version = 1;
  let docExists = await db.get('SELECT * FROM documents_history WHERE path = ? AND name = ?', [path, docName]);

  while (docExists)
  {
    version += 1;
    docName = `${name}-${version}`;
    docExists = await db.get('SELECT * FROM documents_history WHERE path = ? AND name = ?', [path, docName]);
  }

  const docId = await idGen();
  await db.run('INSERT INTO documents (id, createdBy) VALUES (?, ?)', [docId, req.user?.id]);
  await db.run('INSERT INTO documents_history (id, document_id, path, name, content, version, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [await idGen(), docId, path, docName, content, version, new Date().toISOString(), req.user?.id]);
  res.status(201).json({ message: 'Document created successfully' });
});

router.put('/:docId', authenticateToken, authorizePermission('canEdit'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { docId } = req.params;
  const { content } = req.body;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [docId]);
  if (!doc)
  {
    return res.status(404).json({ message: 'Document not found' });
  }

  const newVersion = (await db.get('SELECT MAX(version) as maxVersion FROM documents_history WHERE document_id = ?', [docId])).maxVersion + 1;
  await db.run('INSERT INTO documents_history (id, document_id, path, name, content, version, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [await idGen(), docId, doc.path, doc.name, content, newVersion, new Date().toISOString(), req.user?.id]);
  res.json({ message: 'Document updated successfully' });
});

router.delete('/:docId', authenticateToken, authorizePermission('canDelete'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { docId } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  await db.run('DELETE FROM documents WHERE id = ?', [docId]);
  await db.run('DELETE FROM documents_history WHERE document_id = ?', [docId]);
  res.json({ message: 'Document deleted successfully' });
});

router.post('/revert/:docId/:version', authenticateToken, authorizePermission('canEdit'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { docId, version } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  const docVersion = await db.get('SELECT * FROM documents_history WHERE document_id = ? AND version = ?', [docId, version]);
  if (!docVersion)
  {
    return res.status(404).json({ message: 'Document version not found' });
  }

  const newVersion = (await db.get('SELECT MAX(version) as maxVersion FROM documents_history WHERE document_id = ?', [docId])).maxVersion + 1;
  await db.run('INSERT INTO documents_history (id, document_id, path, name, content, version, createdAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [await idGen(), docId, docVersion.path, docVersion.name, docVersion.content, newVersion, new Date().toISOString(), req.user?.id]);
  res.json({ message: 'Document reverted successfully' });
});

router.get('/diff/:docId/:version1/:version2', authenticateToken, authorizePermission('canView'), async (req: AuthenticatedRequest, res: Response) =>
{
  const { docId, version1, version2 } = req.params;
  const db = await open({ filename: process.env.DATABASE_PATH!, driver: sqlite3.Database });

  const docVersion1 = await db.get('SELECT * FROM documents_history WHERE document_id = ? AND version = ?', [docId, version1]);
  const docVersion2 = await db.get('SELECT * FROM documents_history WHERE document_id = ? AND version = ?', [docId, version2]);

  if (!docVersion1 || !docVersion2)
  {
    return res.status(404).json({ message: 'Document version not found' });
  }

  const diff = require('diff');
  const differences = diff.diffLines(docVersion1.content, docVersion2.content);
  res.json(differences);
});

export default router;
