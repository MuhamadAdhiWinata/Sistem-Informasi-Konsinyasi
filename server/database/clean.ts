import mysql from 'mysql2/promise';

async function main() {
  console.log('Cleaning all tables...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'SITJ_DB',
    multipleStatements: true,
  });

  try {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME != '__drizzle_migrations'",
      [process.env.DB_NAME || 'SITJ_DB']
    );

    const tables = rows.map(r => r.TABLE_NAME as string);

    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tables) {
      await connection.execute(`DELETE FROM \`${table}\``);
      console.log(`  ✔ ${table} cleared`);
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log(`\n✅ ${tables.length} tables cleared successfully!`);
  } catch (err) {
    console.error('❌ Clean failed:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
