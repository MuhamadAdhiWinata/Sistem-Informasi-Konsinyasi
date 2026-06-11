import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import * as schema from './schema';

async function main() {
  console.log('Seeding database...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'SITJ_DB',
  });

  const db = drizzle(connection, { schema, mode: 'default' });

  try {
    // 1. Seed Gudang
    console.log('Seeding gudang...');
    await db.insert(schema.gudang).values([
      { kode: 'GDG-001', nama: 'Gudang Pusat Jakarta', alamat: 'Jl. Sudirman No. 1, Jakarta', apakahAktif: 1 },
      { kode: 'GDG-002', nama: 'Gudang Cabang Bandung', alamat: 'Jl. Asia Afrika No. 10, Bandung', apakahAktif: 1 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } }); // ignore if exists

    // Fetch gudang for relations
    const gudangs = await db.select().from(schema.gudang);

    // 2. Seed Pemasok
    console.log('Seeding pemasok...');
    await db.insert(schema.pemasok).values([
      { nama: 'PT Indofood CBP', kategoriMerek: 'Makanan', narahubung: 'Budi', apakahAktif: 1 },
      { nama: 'PT Mayora Indah', kategoriMerek: 'Snack', narahubung: 'Siti', apakahAktif: 1 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } });
    
    const pemasoks = await db.select().from(schema.pemasok);

    // 3. Seed Pengguna (Users)
    console.log('Seeding pengguna...');
    // Note: password_hash uses dummy string for now. In real app, use bcrypt.
    await db.insert(schema.pengguna).values([
      { nama: 'Admin Pusat', email: 'admin@sikons.com', passwordHash: 'hashedpassword123', peran: 'penyalur', apakahAktif: 1 },
      { nama: 'Sales Bandung', email: 'sales1@sikons.com', passwordHash: 'hashedpassword123', peran: 'sales', apakahAktif: 1 },
      { nama: 'Toko Makmur', email: 'mitra1@sikons.com', passwordHash: 'hashedpassword123', peran: 'mitra', apakahAktif: 1 },
      { nama: 'Supplier Indofood', email: 'supplier1@sikons.com', passwordHash: 'hashedpassword123', peran: 'pemasok', idPemasok: pemasoks[0].id, apakahAktif: 1 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } });

    const penggunas = await db.select().from(schema.pengguna);
    const sales = penggunas.find(p => p.peran === 'sales');

    // 4. Seed Mitra
    console.log('Seeding mitra...');
    await db.insert(schema.mitra).values([
      { nama: 'Toko Sembako Makmur', namaPemilik: 'Pak Joko', telepon: '081234567890', lat: '-6.914744', lng: '107.609810', idSalesDitugaskan: sales?.id, apakahAktif: 1 },
      { nama: 'Warung Bu Ani', namaPemilik: 'Bu Ani', telepon: '089876543210', lat: '-6.920000', lng: '107.610000', idSalesDitugaskan: sales?.id, apakahAktif: 1 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } });

    // Update mitra reference for the 'Toko Makmur' user
    const mitras = await db.select().from(schema.mitra);
    await db.update(schema.pengguna).set({ idMitra: mitras[0].id }).where(sql`email = 'mitra1@sikons.com'`);

    // 5. Seed Produk
    console.log('Seeding produk...');
    await db.insert(schema.produk).values([
      { sku: 'IND-M-001', nama: 'Indomie Goreng', idPemasok: pemasoks[0].id, satuan: 'Kardus', hargaTebus: '100000', hargaJual: '115000', apakahAktif: 1 },
      { sku: 'MYR-S-001', nama: 'Beng Beng', idPemasok: pemasoks[1].id, satuan: 'Box', hargaTebus: '25000', hargaJual: '30000', apakahAktif: 1 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } });

    const produks = await db.select().from(schema.produk);

    // 6. Seed Stok Gudang
    console.log('Seeding stok gudang...');
    await db.insert(schema.stokGudang).values([
      { idGudang: gudangs[0].id, idProduk: produks[0].id, jumlah: 500 },
      { idGudang: gudangs[0].id, idProduk: produks[1].id, jumlah: 300 },
    ]).onDuplicateKeyUpdate({ set: { id: sql`id` } });

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await connection.end();
  }
}

main();
