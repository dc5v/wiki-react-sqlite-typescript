import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config';

export const initializeDB = async () =>
{
  const db = await open({
    filename: process.env.DATABASE_PATH!,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS idgen (
      id TEXT PRIMARY KEY,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_id TEXT,
      password TEXT,
      joined TEXT NOT NULL,
      lastLogin TEXT,
      memo TEXT,
      group_id TEXT,
      canView INTEGER DEFAULT 0,
      canEdit INTEGER DEFAULT 0,
      canDelete INTEGER DEFAULT 0,
      canCreate INTEGER DEFAULT 0,
      isBanned INTEGER DEFAULT 0,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      canView INTEGER DEFAULT 0,
      canEdit INTEGER DEFAULT 0,
      canDelete INTEGER DEFAULT 0,
      canCreate INTEGER DEFAULT 0
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      avatar TEXT,
      email TEXT,
      provider TEXT,
      uri TEXT,
      documentName TEXT,
      requestFunction TEXT,
      parameters TEXT,
      statusCode INTEGER,
      ip TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents_history (
      id TEXT PRIMARY KEY,
      document_id TEXT,
      path TEXT NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      wikiName TEXT,
      styleFileName TEXT,
      canAnyoneRead INTEGER DEFAULT 0,
      canAnyoneWrite INTEGER DEFAULT 0,
      restrictedPaths TEXT
    );
  `);

  return db;
};