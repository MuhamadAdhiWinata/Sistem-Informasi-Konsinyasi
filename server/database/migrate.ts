import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function main() {
  console.log('Running migrations...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'SITJ_DB',
    multipleStatements: true,
  });

  const db = drizzle(connection);

  try {
    await migrate(db, { migrationsFolder: './server/database/migrations' });
    console.log('Migrations applied successfully!');
  } catch (err) {
    console.error('Failed to apply migrations:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
