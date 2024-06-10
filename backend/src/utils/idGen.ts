import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import 'dotenv/config';

export const idGen = async (): Promise<string> =>
{
  const db = await open({
    filename: process.env.DATABASE_PATH!,
    driver: sqlite3.Database
  });

  const epochTime = Date.now().toString(16);

  for (let i = 0; i <= 255; i++)
  {
    const inc = i.toString(16).padStart(2, '0');
    const id = epochTime + inc;

    const idExists = await db.get('SELECT id FROM idgen WHERE id = ?', id);

    if (!idExists)
    {
      await db.get('INSERT INTO idgen (id) VALUES (?)', id);
      await db.close();
      return id;
    }
  }

  throw new Error('Failed to generate unique ID');
};

