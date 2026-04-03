import { NextRequest } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  // Initialize table
  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);

  // Insert sample data if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO users (name) VALUES (?)');
    insert.run('Alice');
    insert.run('Bob');
    insert.run('Charlie');
  }

  const users = db.prepare('SELECT * FROM users').all();
  return Response.json(users);
}