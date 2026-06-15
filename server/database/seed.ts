import { drizzle } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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
  const stockMap = new Map<string, number>();
  function sk(g: number, p: number) { return `${g}_${p}` }
  function getStock(g: number, p: number) { return stockMap.get(sk(g, p)) ?? 0 }
  function addStock(g: number, p: number, q: number) { stockMap.set(sk(g, p), getStock(g, p) + q) }
  function subStock(g: number, p: number, q: number) { stockMap.set(sk(g, p), getStock(g, p) - q) }

  try {
    // ── Clean all tables (reverse FK order) ──
    console.log('Cleaning existing data...');
    await db.delete(schema.itemOpname);
    await db.delete(schema.opnameStok);
    await db.delete(schema.faktur);
    await db.delete(schema.itemPenyaluran);
    await db.delete(schema.itemPermintaanStok);
    await db.delete(schema.permintaanStok);
    await db.delete(schema.penyaluran);
    await db.delete(schema.itemPenerimaanBarang);
    await db.delete(schema.penerimaanBarang);
    await db.delete(schema.stokGudang);
    await db.delete(schema.produk);
    await db.delete(schema.mitra);
    await db.delete(schema.pengguna);
    await db.delete(schema.pemasok);
    await db.delete(schema.gudang);

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('password123', salt);

    // ═══════════════════════════════════════════
    //  1. GUDANG
    // ═══════════════════════════════════════════
    console.log('Seeding gudang...');
    await db.insert(schema.gudang).values([
      { kode: 'GDG-PST', nama: 'Gudang Pusat Jakarta', alamat: 'Jl. Sudirman No. 1, Jakarta Pusat', apakahAktif: 1 },
      { kode: 'GDG-BDG', nama: 'Gudang Cabang Bandung', alamat: 'Jl. Asia Afrika No. 10, Bandung', apakahAktif: 1 },
      { kode: 'GDG-SBY', nama: 'Gudang Surabaya', alamat: 'Jl. Tunjungan No. 5, Surabaya', apakahAktif: 1 },
    ]);
    const [gPusat, gBandung, gSurabaya] = await db.select().from(schema.gudang).orderBy(sql`id`);

    // ═══════════════════════════════════════════
    //  2. PEMASOK (10 — minuman)
    // ═══════════════════════════════════════════
    console.log('Seeding pemasok...');
    const pemasokData = [
      { nama: 'PT Wings Surya', kategoriMerek: 'Minuman Ringan', narahubung: 'Agus Wijaya' },
      { nama: 'PT Mayora Indah Tbk', kategoriMerek: 'Minuman & Snack', narahubung: 'Dewi Lestari' },
      { nama: 'PT Kalbe Farma Tbk', kategoriMerek: 'Minuman Kesehatan', narahubung: 'Rina Safitri' },
      { nama: 'PT Coca-Cola Indonesia', kategoriMerek: 'Soft Drink', narahubung: 'Bambang Hartono' },
      { nama: 'PT Sinar Sosro', kategoriMerek: 'Teh Siap Minum', narahubung: 'Sari Dewi' },
      { nama: 'PT Ultra Jaya Milk Tbk', kategoriMerek: 'Susu & Sari Buah', narahubung: 'Hendra Gunawan' },
      { nama: 'PT Yakult Indonesia Persada', kategoriMerek: 'Minuman Probiotik', narahubung: 'Lina Marlina' },
      { nama: 'PT Indofood CBP Sukses Makmur', kategoriMerek: 'Minuman & Makanan', narahubung: 'Budi Santoso' },
      { nama: 'PT PepsiCo Indonesia', kategoriMerek: 'Soft Drink', narahubung: 'Rudi Hermawan' },
      { nama: 'PT Rejowinangun (Jamu Jago)', kategoriMerek: 'Minuman Herbal', narahubung: 'Slamet Riyadi' },
    ];
    await db.insert(schema.pemasok).values(pemasokData.map(p => ({ ...p, apakahAktif: 1 })));
    const [pWings, pMayora, pKalbe, pCoca, pSosro, pUltra, pYakult, pIndofood, pPepsi, pJago] =
      await db.select().from(schema.pemasok).orderBy(sql`id`);

    // ═══════════════════════════════════════════
    //  3. PRODUK (25 — semua minuman)
    // ═══════════════════════════════════════════
    console.log('Seeding produk...');
    const produkData = [
      { sku: 'WNG-FLO-250', nama: 'Floridina Orange 250ml', pemasok: pWings, satuan: 'Botol', hp: '4000', hg: '4700', hr: '5500' },
      { sku: 'WNG-FLL-250', nama: 'Floridina Lychee 250ml', pemasok: pWings, satuan: 'Botol', hp: '4000', hg: '4700', hr: '5500' },
      { sku: 'WNG-FTR-350', nama: 'Freshtea Raslemon 350ml', pemasok: pWings, satuan: 'Botol', hp: '3500', hg: '4200', hr: '5000' },
      { sku: 'MYR-KP78-150', nama: 'Kopiko 78 Coffee 150ml', pemasok: pMayora, satuan: 'Botol', hp: '4500', hg: '5200', hr: '6000' },
      { sku: 'MYR-KPB-200', nama: 'Kopiko Blister 200ml', pemasok: pMayora, satuan: 'Botol', hp: '5000', hg: '5700', hr: '6500' },
      { sku: 'MYR-TRS-200', nama: 'Torres 200ml', pemasok: pMayora, satuan: 'Botol', hp: '4200', hg: '4900', hr: '5800' },
      { sku: 'KLB-KRT-250', nama: 'Kiranti 250ml', pemasok: pKalbe, satuan: 'Botol', hp: '5000', hg: '5800', hr: '6500' },
      { sku: 'KLB-FTG-150', nama: 'Fatigon Spirit 150ml', pemasok: pKalbe, satuan: 'Botol', hp: '3800', hg: '4500', hr: '5200' },
      { sku: 'KLB-PRM-100', nama: 'Promag Syrup 100ml', pemasok: pKalbe, satuan: 'Botol', hp: '3200', hg: '3800', hr: '4500' },
      { sku: 'CCL-COLA-390', nama: 'Coca-Cola 390ml', pemasok: pCoca, satuan: 'Botol', hp: '4500', hg: '5200', hr: '6000' },
      { sku: 'CCL-SPR-390', nama: 'Sprite 390ml', pemasok: pCoca, satuan: 'Botol', hp: '4500', hg: '5200', hr: '6000' },
      { sku: 'CCL-FAN-390', nama: 'Fanta Strawberry 390ml', pemasok: pCoca, satuan: 'Botol', hp: '4500', hg: '5200', hr: '6000' },
      { sku: 'SOS-TBS-350', nama: 'Teh Botol Sosro 350ml', pemasok: pSosro, satuan: 'Botol', hp: '3500', hg: '4200', hr: '5000' },
      { sku: 'SOS-FTM-350', nama: 'Fruit Tea Markisa 350ml', pemasok: pSosro, satuan: 'Botol', hp: '3500', hg: '4200', hr: '5000' },
      { sku: 'ULT-UMF-250', nama: 'Ultra Milk Full Cream 250ml', pemasok: pUltra, satuan: 'Kotak', hp: '5000', hg: '5700', hr: '6500' },
      { sku: 'ULT-UMC-250', nama: 'Ultra Milk Coklat 250ml', pemasok: pUltra, satuan: 'Kotak', hp: '5000', hg: '5700', hr: '6500' },
      { sku: 'ULT-SBJ-250', nama: 'Ultra Sari Buah Jambu 250ml', pemasok: pUltra, satuan: 'Kotak', hp: '4500', hg: '5200', hr: '6000' },
      { sku: 'YKT-ORI-65', nama: 'Yakult Original 65ml', pemasok: pYakult, satuan: 'Botol', hp: '1700', hg: '1900', hr: '2200' },
      { sku: 'IND-ICO-350', nama: 'Ichi Ocha 350ml', pemasok: pIndofood, satuan: 'Botol', hp: '3200', hg: '3800', hr: '4500' },
      { sku: 'IND-TSK-300', nama: 'Teh Sarikoe 300ml', pemasok: pIndofood, satuan: 'Botol', hp: '2800', hg: '3300', hr: '4000' },
      { sku: 'PEP-COLA-390', nama: 'Pepsi Cola 390ml', pemasok: pPepsi, satuan: 'Botol', hp: '4200', hg: '4900', hr: '5800' },
      { sku: 'PEP-MIR-390', nama: 'Mirinda Orange 390ml', pemasok: pPepsi, satuan: 'Botol', hp: '4200', hg: '4900', hr: '5800' },
      { sku: 'JGO-KBE-100', nama: 'Kuku Bima Ener-G 100ml', pemasok: pJago, satuan: 'Botol', hp: '2500', hg: '3000', hr: '3500' },
      { sku: 'JGO-TAG-15', nama: 'Tolak Angin 15ml', pemasok: pJago, satuan: 'Sachet', hp: '1200', hg: '1400', hr: '1700' },
    ];
    await db.insert(schema.produk).values(
      produkData.map(p => ({ sku: p.sku, nama: p.nama, idPemasok: p.pemasok.id, satuan: p.satuan, hargaPabrik: p.hp, hargaGrosir: p.hg, hargaRetail: p.hr, apakahAktif: 1 }))
    );
    const produk = await db.select().from(schema.produk).orderBy(sql`id`);

    // ═══════════════════════════════════════════
    //  4. PENGUNA (11)
    // ═══════════════════════════════════════════
    console.log('Seeding pengguna...');
    await db.insert(schema.pengguna).values([
      { nama: 'Admin Pusat', email: 'admin@sikons.com', passwordHash: hashed, peran: 'penyalur', apakahAktif: 1 },
      { nama: 'Rudi Sales', email: 'rudi@sikons.com', passwordHash: hashed, peran: 'sales', apakahAktif: 1 },
      { nama: 'Sari Sales', email: 'sari@sikons.com', passwordHash: hashed, peran: 'sales', apakahAktif: 1 },
      { nama: 'Budi Mitra', email: 'budi@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Ani Mitra', email: 'ani@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Citra Mitra', email: 'citra@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Dedi Mitra', email: 'dedi@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Euis Mitra', email: 'euis@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Fajar Mitra', email: 'fajar@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Supplier Wings', email: 'wings@sikons.com', passwordHash: hashed, peran: 'pemasok', idPemasok: pWings.id, apakahAktif: 1 },
      { nama: 'Supplier Mayora', email: 'mayora@sikons.com', passwordHash: hashed, peran: 'pemasok', idPemasok: pMayora.id, apakahAktif: 1 },
    ]);

    const allUsers = await db.select().from(schema.pengguna).orderBy(sql`id`);
    const admin = allUsers.find(u => u.email === 'admin@sikons.com')!;
    const salesRudi = allUsers.find(u => u.email === 'rudi@sikons.com')!;
    const salesSari = allUsers.find(u => u.email === 'sari@sikons.com')!;
    const userBudi = allUsers.find(u => u.email === 'budi@sikons.com')!;
    const userAni = allUsers.find(u => u.email === 'ani@sikons.com')!;
    const userCitra = allUsers.find(u => u.email === 'citra@sikons.com')!;
    const userDedi = allUsers.find(u => u.email === 'dedi@sikons.com')!;
    const userEuis = allUsers.find(u => u.email === 'euis@sikons.com')!;
    const userFajar = allUsers.find(u => u.email === 'fajar@sikons.com')!;

    // ═══════════════════════════════════════════
    //  5. MITRA (6)
    // ═══════════════════════════════════════════
    console.log('Seeding mitra...');
    await db.insert(schema.mitra).values([
      { nama: 'Toko Budi', namaPemilik: 'Budi Santoso', telepon: '081234567890', alamat: 'Jl. Merdeka No. 45, Bandung', lat: '-6.914744', lng: '107.609810', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Warung Ani', namaPemilik: 'Ani Rahmawati', telepon: '089876543210', alamat: 'Jl. Diponegoro No. 12, Bandung', lat: '-6.920000', lng: '107.610000', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Kios Citra', namaPemilik: 'Citra Dewi', telepon: '085711223344', alamat: 'Jl. Panglima Sudirman No. 8, Surabaya', lat: '-7.250000', lng: '112.750000', idSalesDitugaskan: salesSari.id, apakahAktif: 1 },
      { nama: 'Toko Dedi', namaPemilik: 'Dedi Haryanto', telepon: '081312345678', alamat: 'Jl. Gatot Subroto No. 23, Jakarta Pusat', lat: '-6.200000', lng: '106.820000', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Warung Euis', namaPemilik: 'Euis Siti', telepon: '082198765432', alamat: 'Jl. Setiabudi No. 67, Bandung', lat: '-6.890000', lng: '107.590000', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Kios Fajar', namaPemilik: 'Fajar Prasetyo', telepon: '083145678901', alamat: 'Jl. Darmo No. 34, Surabaya', lat: '-7.280000', lng: '112.730000', idSalesDitugaskan: salesSari.id, apakahAktif: 1 },
    ]);
    const [mitraBudi, mitraAni, mitraCitra, mitraDedi, mitraEuis, mitraFajar] =
      await db.select().from(schema.mitra).orderBy(sql`id`);

    await db.update(schema.pengguna).set({ idMitra: mitraBudi.id }).where(eq(schema.pengguna.id, userBudi.id));
    await db.update(schema.pengguna).set({ idMitra: mitraAni.id }).where(eq(schema.pengguna.id, userAni.id));
    await db.update(schema.pengguna).set({ idMitra: mitraCitra.id }).where(eq(schema.pengguna.id, userCitra.id));
    await db.update(schema.pengguna).set({ idMitra: mitraDedi.id }).where(eq(schema.pengguna.id, userDedi.id));
    await db.update(schema.pengguna).set({ idMitra: mitraEuis.id }).where(eq(schema.pengguna.id, userEuis.id));
    await db.update(schema.pengguna).set({ idMitra: mitraFajar.id }).where(eq(schema.pengguna.id, userFajar.id));

    // ═══════════════════════════════════════════
    //  6. STOK GUDANG AWAL — semua gudang, semua produk
    // ═══════════════════════════════════════════
    console.log('Seeding stok gudang awal...');
    const initialStock: { g: typeof gPusat, qty: number }[] = [
      { g: gPusat, qty: 200 }, { g: gBandung, qty: 150 }, { g: gSurabaya, qty: 120 },
    ];
    for (const p of produk) {
      for (const s of initialStock) {
        await db.insert(schema.stokGudang).values([
          { idGudang: s.g.id, idProduk: p.id, jumlah: s.qty, diperbaruiPada: new Date() },
        ]);
        addStock(s.g.id, p.id, s.qty);
      }
    }

    // ═══════════════════════════════════════════
    //  7. PENERIMAAN BARANG (8 GR — all completed)
    // ═══════════════════════════════════════════
    console.log('Seeding penerimaan barang...');

    interface GRItem { produkIdx: number; jumlah: number; hargaPabrikAktual: string }

    const grData: { nomor: string; pemasok: typeof pWings; gudang: typeof gPusat; tgl: Date; items: GRItem[] }[] = [
      {
        nomor: 'GR-20260601-0001', pemasok: pWings, gudang: gPusat, tgl: new Date('2026-06-01'),
        items: [
          { produkIdx: 0, jumlah: 80, hargaPabrikAktual: '4000' },
          { produkIdx: 1, jumlah: 70, hargaPabrikAktual: '4000' },
          { produkIdx: 2, jumlah: 60, hargaPabrikAktual: '3500' },
        ],
      },
      {
        nomor: 'GR-20260602-0001', pemasok: pMayora, gudang: gPusat, tgl: new Date('2026-06-02'),
        items: [
          { produkIdx: 3, jumlah: 70, hargaPabrikAktual: '4500' },
          { produkIdx: 4, jumlah: 60, hargaPabrikAktual: '5000' },
          { produkIdx: 5, jumlah: 50, hargaPabrikAktual: '4200' },
        ],
      },
      {
        nomor: 'GR-20260603-0001', pemasok: pCoca, gudang: gBandung, tgl: new Date('2026-06-03'),
        items: [
          { produkIdx: 9, jumlah: 60, hargaPabrikAktual: '4500' },
          { produkIdx: 10, jumlah: 50, hargaPabrikAktual: '4500' },
          { produkIdx: 11, jumlah: 50, hargaPabrikAktual: '4500' },
        ],
      },
      {
        nomor: 'GR-20260604-0001', pemasok: pSosro, gudang: gBandung, tgl: new Date('2026-06-04'),
        items: [
          { produkIdx: 12, jumlah: 70, hargaPabrikAktual: '3500' },
          { produkIdx: 13, jumlah: 60, hargaPabrikAktual: '3500' },
        ],
      },
      {
        nomor: 'GR-20260605-0001', pemasok: pUltra, gudang: gSurabaya, tgl: new Date('2026-06-05'),
        items: [
          { produkIdx: 14, jumlah: 60, hargaPabrikAktual: '5000' },
          { produkIdx: 15, jumlah: 50, hargaPabrikAktual: '5000' },
          { produkIdx: 16, jumlah: 40, hargaPabrikAktual: '4500' },
        ],
      },
      {
        nomor: 'GR-20260606-0001', pemasok: pYakult, gudang: gPusat, tgl: new Date('2026-06-06'),
        items: [
          { produkIdx: 17, jumlah: 100, hargaPabrikAktual: '1700' },
        ],
      },
      {
        nomor: 'GR-20260607-0001', pemasok: pIndofood, gudang: gPusat, tgl: new Date('2026-06-07'),
        items: [
          { produkIdx: 18, jumlah: 70, hargaPabrikAktual: '3200' },
          { produkIdx: 19, jumlah: 60, hargaPabrikAktual: '2800' },
        ],
      },
      {
        nomor: 'GR-20260610-0001', pemasok: pPepsi, gudang: gSurabaya, tgl: new Date('2026-06-10'),
        items: [
          { produkIdx: 20, jumlah: 50, hargaPabrikAktual: '4200' },
          { produkIdx: 21, jumlah: 40, hargaPabrikAktual: '4200' },
        ],
      },
    ];

    for (const gr of grData) {
      await db.insert(schema.penerimaanBarang).values([{
        nomorPenerimaan: gr.nomor, idPemasok: gr.pemasok.id, idGudang: gr.gudang.id,
        diterimaOleh: admin.id, tanggalPenerimaan: gr.tgl, status: 'completed',
      }]);
      const [header] = await db.select().from(schema.penerimaanBarang).where(sql`nomor_penerimaan = ${gr.nomor}`);
      for (const item of gr.items) {
        const prod = produk[item.produkIdx];
        await db.insert(schema.itemPenerimaanBarang).values([{
          idPenerimaan: header.id, idProduk: prod.id, jumlah: item.jumlah,
          hargaPabrikAktual: item.hargaPabrikAktual,
        }]);
        await db.update(schema.stokGudang)
          .set({ jumlah: sql`jumlah + ${item.jumlah}`, diperbaruiPada: sql`CURRENT_TIMESTAMP` })
          .where(sql`id_gudang = ${gr.gudang.id} AND id_produk = ${prod.id}`);
        addStock(gr.gudang.id, prod.id, item.jumlah);
      }
    }

    // ═══════════════════════════════════════════
    //  8. PENYALURAN + FAKTUR (8 DEL — all received)
    // ═══════════════════════════════════════════
    console.log('Seeding penyaluran & faktur...');

    interface DELItem { produkIdx: number; jumlahDikirim: number }

    const delData: {
      nomor: string; gudang: typeof gPusat; mitra: typeof mitraBudi; sales: typeof salesRudi; tgl: Date;
      items: DELItem[]
    }[] = [
      {
        nomor: 'DEL-20260604-0001', gudang: gPusat, mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-04'),
        items: [
          { produkIdx: 0, jumlahDikirim: 30 },
          { produkIdx: 3, jumlahDikirim: 20 },
          { produkIdx: 18, jumlahDikirim: 25 },
        ],
      },
      {
        nomor: 'DEL-20260605-0001', gudang: gPusat, mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-05'),
        items: [
          { produkIdx: 1, jumlahDikirim: 25 },
          { produkIdx: 4, jumlahDikirim: 20 },
          { produkIdx: 19, jumlahDikirim: 20 },
        ],
      },
      {
        nomor: 'DEL-20260606-0001', gudang: gBandung, mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-06'),
        items: [
          { produkIdx: 9, jumlahDikirim: 20 },
          { produkIdx: 12, jumlahDikirim: 25 },
          { produkIdx: 13, jumlahDikirim: 15 },
        ],
      },
      {
        nomor: 'DEL-20260607-0001', gudang: gPusat, mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-07'),
        items: [
          { produkIdx: 0, jumlahDikirim: 20 },
          { produkIdx: 5, jumlahDikirim: 15 },
          { produkIdx: 18, jumlahDikirim: 15 },
        ],
      },
      {
        nomor: 'DEL-20260608-0001', gudang: gBandung, mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-08'),
        items: [
          { produkIdx: 10, jumlahDikirim: 15 },
          { produkIdx: 11, jumlahDikirim: 10 },
        ],
      },
      {
        nomor: 'DEL-20260609-0001', gudang: gSurabaya, mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-09'),
        items: [
          { produkIdx: 14, jumlahDikirim: 20 },
          { produkIdx: 15, jumlahDikirim: 15 },
          { produkIdx: 20, jumlahDikirim: 15 },
        ],
      },
      {
        nomor: 'DEL-20260611-0001', gudang: gPusat, mitra: mitraDedi, sales: salesRudi,
        tgl: new Date('2026-06-11'),
        items: [
          { produkIdx: 2, jumlahDikirim: 15 },
          { produkIdx: 3, jumlahDikirim: 15 },
          { produkIdx: 17, jumlahDikirim: 30 },
        ],
      },
      {
        nomor: 'DEL-20260614-0001', gudang: gSurabaya, mitra: mitraFajar, sales: salesSari,
        tgl: new Date('2026-06-14'),
        items: [
          { produkIdx: 16, jumlahDikirim: 15 },
          { produkIdx: 20, jumlahDikirim: 10 },
          { produkIdx: 21, jumlahDikirim: 10 },
        ],
      },
    ];

    for (const del of delData) {
      await db.insert(schema.penyaluran).values([{
        nomorPenyaluran: del.nomor, idGudangAsal: del.gudang.id, idMitra: del.mitra.id,
        idSales: del.sales.id, tanggalPenyaluran: del.tgl, status: 'received', dibuatOleh: admin.id,
      }]);
      const [header] = await db.select().from(schema.penyaluran).where(sql`nomor_penyaluran = ${del.nomor}`);
      for (const item of del.items) {
        const prod = produk[item.produkIdx];
        await db.insert(schema.itemPenyaluran).values([{
          idPenyaluran: header.id, idProduk: prod.id, jumlahDikirim: item.jumlahDikirim,
          snapshotHargaRetail: prod.hargaRetail, snapshotHargaGrosir: prod.hargaGrosir,
        }]);
        const stok = getStock(del.gudang.id, prod.id);
        if (stok < item.jumlahDikirim) {
          throw new Error(`[BALANCE ERROR] Stok ${prod.nama} di gudang ${del.gudang.id} hanya ${stok}, butuh ${item.jumlahDikirim}`);
        }
        await db.update(schema.stokGudang)
          .set({ jumlah: sql`jumlah - ${item.jumlahDikirim}`, diperbaruiPada: sql`CURRENT_TIMESTAMP` })
          .where(sql`id_gudang = ${del.gudang.id} AND id_produk = ${prod.id}`);
        subStock(del.gudang.id, prod.id, item.jumlahDikirim);
      }
    }

    // Faktur — untuk semua penyaluran
    const allDel = await db.select().from(schema.penyaluran).orderBy(sql`id`);
    for (const del of allDel) {
      const items = await db.select().from(schema.itemPenyaluran).where(sql`id_penyaluran = ${del.id}`);
      const total = items.reduce((sum, it) => sum + Number(it.jumlahDikirim) * Number(it.snapshotHargaRetail), 0);
      const nomorFaktur = `INV-2026-${String(del.id).padStart(4, '0')}`;
      await db.insert(schema.faktur).values([{
        nomorFaktur, idPenyaluran: del.id,
        totalNilai: String(total), diterbitkanPada: del.tanggalPenyaluran,
      }]);
    }

    // ═══════════════════════════════════════════
    //  9. OPNAME STOK (8 opname — all verified)
    // ═══════════════════════════════════════════
    console.log('Seeding opname stok...');

    interface OPItem { produkIdx: number; stokAwal: number; laku: number; retur: number; kondisi: string | null; hilang?: number; penanggungHilang?: string; anomali?: number }

    const opData: {
      nomor: string; mitra: typeof mitraBudi; sales: typeof salesRudi; tgl: Date;
      items: OPItem[]
    }[] = [
      {
        nomor: 'OP-20260610-0001', mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-10'),
        items: [
          { produkIdx: 0, stokAwal: 30, laku: 18, retur: 2, kondisi: 'good' },
          { produkIdx: 3, stokAwal: 20, laku: 12, retur: 1, kondisi: 'good' },
          { produkIdx: 18, stokAwal: 25, laku: 20, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260611-0001', mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-11'),
        items: [
          { produkIdx: 1, stokAwal: 25, laku: 15, retur: 3, kondisi: 'expired' },
          { produkIdx: 4, stokAwal: 20, laku: 12, retur: 2, kondisi: 'damaged' },
          { produkIdx: 19, stokAwal: 20, laku: 14, retur: 1, kondisi: 'good' },
        ],
      },
      {
        nomor: 'OP-20260612-0001', mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-12'),
        items: [
          { produkIdx: 9, stokAwal: 20, laku: 10, retur: 2, kondisi: 'good' },
          { produkIdx: 12, stokAwal: 25, laku: 18, retur: 1, kondisi: 'good' },
          { produkIdx: 13, stokAwal: 15, laku: 8, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260612-0002', mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-12'),
        items: [
          { produkIdx: 0, stokAwal: 10, laku: 6, retur: 1, kondisi: 'good' },
          { produkIdx: 5, stokAwal: 15, laku: 8, retur: 2, kondisi: 'good' },
          { produkIdx: 18, stokAwal: 5, laku: 4, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260613-0001', mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-13'),
        items: [
          { produkIdx: 10, stokAwal: 15, laku: 8, retur: 2, kondisi: 'good' },
          { produkIdx: 11, stokAwal: 10, laku: 6, retur: 1, kondisi: 'good' },
        ],
      },
      {
        nomor: 'OP-20260613-0002', mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-13'),
        items: [
          { produkIdx: 14, stokAwal: 20, laku: 12, retur: 2, kondisi: 'good' },
          { produkIdx: 15, stokAwal: 15, laku: 10, retur: 1, kondisi: 'good' },
          { produkIdx: 20, stokAwal: 15, laku: 8, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260614-0001', mitra: mitraDedi, sales: salesRudi,
        tgl: new Date('2026-06-14'),
        items: [
          { produkIdx: 2, stokAwal: 15, laku: 10, retur: 1, kondisi: 'good' },
          { produkIdx: 3, stokAwal: 15, laku: 8, retur: 1, kondisi: 'good' },
          { produkIdx: 17, stokAwal: 30, laku: 20, retur: 3, kondisi: 'good' },
        ],
      },
      {
        nomor: 'OP-20260614-0002', mitra: mitraFajar, sales: salesSari,
        tgl: new Date('2026-06-14'),
        items: [
          { produkIdx: 16, stokAwal: 15, laku: 8, retur: 2, kondisi: 'good' },
          { produkIdx: 20, stokAwal: 10, laku: 6, retur: 0, kondisi: null },
          { produkIdx: 21, stokAwal: 10, laku: 7, retur: 1, kondisi: 'good' },
        ],
      },
    ];

    for (const op of opData) {
      const hasAnomali = op.items.some(it => it.anomali === 1 || (it.stokAwal - it.laku - it.retur - (it.hilang ?? 0) < 0));
      await db.insert(schema.opnameStok).values([{
        nomorOpname: op.nomor, idMitra: op.mitra.id, idSales: op.sales.id,
        tanggalKunjungan: op.tgl, status: 'verified', memilikiAnomali: hasAnomali ? 1 : 0, dibuatOleh: op.sales.id,
      }]);
      const [oh] = await db.select().from(schema.opnameStok).where(sql`nomor_opname = ${op.nomor}`);
      for (const it of op.items) {
        const prod = produk[it.produkIdx];
        const stokFisik = Math.max(0, it.stokAwal - it.laku - it.retur - (it.hilang ?? 0));
        const anomali = it.anomali === 1 || stokFisik < 0 ? 1 : 0;
        await db.insert(schema.itemOpname).values([{
          idOpname: oh.id, idProduk: prod.id, stokAwal: it.stokAwal,
          jumlahLaku: it.laku, jumlahRetur: it.retur, hilang: it.hilang ?? 0,
          penanggungHilang: (it.penanggungHilang ?? 'penyalur') as 'penyalur' | 'mitra',
          stokFisik: Math.max(0, stokFisik),
          kondisiRetur: it.kondisi as 'good' | 'damaged' | 'expired' | null,
          apakahAnomali: anomali,
        }]);
      }
    }

    // ═══════════════════════════════════════════
    //  10. PERMINTAAN RESTOK (4 — all approved)
    // ═══════════════════════════════════════════
    console.log('Seeding permintaan restok...');

    await db.insert(schema.permintaanStok).values([
      { nomorPermintaan: 'RR-20260608-0001', idMitra: mitraBudi.id, dimintaOleh: userBudi.id, status: 'approved', disetujuiOleh: admin.id },
      { nomorPermintaan: 'RR-20260610-0001', idMitra: mitraAni.id, dimintaOleh: userAni.id, status: 'approved', disetujuiOleh: admin.id },
      { nomorPermintaan: 'RR-20260612-0001', idMitra: mitraCitra.id, dimintaOleh: userCitra.id, status: 'approved', disetujuiOleh: admin.id },
      { nomorPermintaan: 'RR-20260614-0001', idMitra: mitraDedi.id, dimintaOleh: userDedi.id, status: 'approved', disetujuiOleh: admin.id },
    ]);
    const [rr1, rr2, rr3, rr4] = await db.select().from(schema.permintaanStok).orderBy(sql`id`);

    await db.insert(schema.itemPermintaanStok).values([
      { idPermintaan: rr1.id, idProduk: produk[0].id, jumlahDiminta: 30, jumlahDisetujui: 30 },
      { idPermintaan: rr1.id, idProduk: produk[3].id, jumlahDiminta: 20, jumlahDisetujui: 20 },
      { idPermintaan: rr1.id, idProduk: produk[18].id, jumlahDiminta: 25, jumlahDisetujui: 20 },
      { idPermintaan: rr2.id, idProduk: produk[1].id, jumlahDiminta: 20, jumlahDisetujui: 20 },
      { idPermintaan: rr2.id, idProduk: produk[4].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr2.id, idProduk: produk[19].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr3.id, idProduk: produk[9].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr3.id, idProduk: produk[12].id, jumlahDiminta: 20, jumlahDisetujui: 20 },
      { idPermintaan: rr3.id, idProduk: produk[14].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr4.id, idProduk: produk[2].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr4.id, idProduk: produk[3].id, jumlahDiminta: 15, jumlahDisetujui: 15 },
      { idPermintaan: rr4.id, idProduk: produk[17].id, jumlahDiminta: 30, jumlahDisetujui: 30 },
    ]);

    // ═══════════════════════════════════════════
    //  SUMMARY
    // ═══════════════════════════════════════════
    const [pemasokCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.pemasok);
    const [penggunaCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.pengguna);
    const [mitraCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.mitra);
    const [produkCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.produk);
    const [grCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.penerimaanBarang);
    const [griCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.itemPenerimaanBarang);
    const [delCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.penyaluran);
    const [fakCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.faktur);
    const [opCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.opnameStok);
    const [opiCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.itemOpname);
    const [rrCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.permintaanStok);

    console.log('');
    console.log('✅ Seeding completed successfully!');
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║            LOGIN CREDENTIALS                 ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║ admin@sikons.com   / password123 (Penyalur)  ║');
    console.log('║ rudi@sikons.com    / password123 (Sales)     ║');
    console.log('║ sari@sikons.com    / password123 (Sales)     ║');
    console.log('║ budi@sikons.com    / password123 (Mitra)     ║');
    console.log('║ ani@sikons.com     / password123 (Mitra)     ║');
    console.log('║ citra@sikons.com   / password123 (Mitra)     ║');
    console.log('║ dedi@sikons.com    / password123 (Mitra)     ║');
    console.log('║ euis@sikons.com    / password123 (Mitra)     ║');
    console.log('║ fajar@sikons.com   / password123 (Mitra)     ║');
    console.log('║ wings@sikons.com   / password123 (Pemasok)   ║');
    console.log('║ mayora@sikons.com  / password123 (Pemasok)   ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    console.log('📦 Data Summary:');
    console.log(`  • ${pemasokCount.count} pemasok`);
    console.log(`  • ${penggunaCount.count} pengguna`);
    console.log(`  • ${mitraCount.count} mitra`);
    console.log(`  • ${produkCount.count} produk`);
    console.log(`  • ${grCount.count} penerimaan barang (${griCount.count} item)`);
    console.log(`  • ${delCount.count} penyaluran`);
    console.log(`  • ${fakCount.count} faktur`);
    console.log(`  • ${opCount.count} opname stok (${opiCount.count} item)`);
    console.log(`  • ${rrCount.count} permintaan restok`);
    console.log('');
    console.log('💰 Faktur:');
    const fakturs = await db.select().from(schema.faktur).orderBy(sql`id`);
    for (const f of fakturs) {
      const [delHdr] = await db.select().from(schema.penyaluran).where(sql`id = ${f.idPenyaluran}`);
      const [mitraName] = await db.select({ nama: schema.mitra.nama }).from(schema.mitra).where(sql`id = ${delHdr.idMitra}`);
      console.log(`  • ${f.nomorFaktur} (${mitraName.nama}): Rp ${Number(f.totalNilai).toLocaleString('id-ID')}`);
    }
    console.log('');
    console.log('Stok Gudang (final):');
    const stokAkhir = await db.select({
      gudang: schema.gudang.nama, produk: schema.produk.nama, jumlah: schema.stokGudang.jumlah,
    }).from(schema.stokGudang)
      .leftJoin(schema.gudang, eq(schema.stokGudang.idGudang, schema.gudang.id))
      .leftJoin(schema.produk, eq(schema.stokGudang.idProduk, schema.produk.id))
      .orderBy(schema.gudang.nama, schema.produk.nama);
    const lastGudang = { nama: '' };
    for (const s of stokAkhir) {
      if (s.gudang !== lastGudang.nama) {
        console.log(`  ${s.gudang}:`);
        lastGudang.nama = s.gudang ?? '';
      }
      console.log(`    • ${s.produk}: ${s.jumlah}`);
    }

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
}

main();
