import Database from 'better-sqlite3';
import { initializeDatabase } from './db-schema';

const db = new Database('db.sqlite');

// Inicializar tablas si no existen
initializeDatabase();

export default db;