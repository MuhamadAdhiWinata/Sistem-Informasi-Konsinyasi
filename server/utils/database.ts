import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

let db: ReturnType<typeof drizzle> | null = null;

export async function useDB() {
  if (!db) {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpassword',
      database: process.env.DB_NAME || 'SITJ_DB',
      waitForConnections: true,
      connectionLimit: 10,
    });

    const { ...schema } = await import('~~/server/database/schema');
    db = drizzle(pool, { schema, mode: 'default' });
  }
  return db!;
}
