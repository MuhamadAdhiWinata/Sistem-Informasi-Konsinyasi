#!/bin/sh
set -e

echo "=== Running migrations ==="
node --import tsx server/database/migrate.ts

echo "=== Checking if seed needed ==="
SEED_COUNT=$(node -e "
  const mysql = require('mysql2/promise');
  mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'SITJ_DB',
  }).then(async (c) => {
    try {
      const [r] = await c.execute('SELECT COUNT(*) as c FROM pengguna');
      console.log(String(r[0].c));
    } catch {
      console.log('0');
    }
    await c.end();
  });
")

if [ "$SEED_COUNT" = "0" ]; then
  echo "Database empty, running seeder..."
  node --import tsx server/database/seed.ts
else
  echo "Database already has data ($SEED_COUNT pengguna records), skipping seed."
fi

echo "=== Init complete ==="
