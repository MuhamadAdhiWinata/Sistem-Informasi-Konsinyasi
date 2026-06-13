import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
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
    await db.delete(schema.prediksiStok);
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
      // Wings — harga per botol
      { sku: 'WNG-FLO-250', nama: 'Floridina Orange 250ml', idPemasok: pWings.id, satuan: 'Botol', hargaTebus: '4000', hargaJualPenyalur: '4700', hargaJual: '5500' },
      { sku: 'WNG-FLL-250', nama: 'Floridina Lychee 250ml', idPemasok: pWings.id, satuan: 'Botol', hargaTebus: '4000', hargaJualPenyalur: '4700', hargaJual: '5500' },
      { sku: 'WNG-FTR-350', nama: 'Freshtea Raslemon 350ml', idPemasok: pWings.id, satuan: 'Botol', hargaTebus: '3500', hargaJualPenyalur: '4200', hargaJual: '5000' },
      // Mayora — harga per botol
      { sku: 'MYR-KP78-150', nama: 'Kopiko 78 Coffee 150ml', idPemasok: pMayora.id, satuan: 'Botol', hargaTebus: '4500', hargaJualPenyalur: '5200', hargaJual: '6000' },
      { sku: 'MYR-KPB-200', nama: 'Kopiko Blister 200ml', idPemasok: pMayora.id, satuan: 'Botol', hargaTebus: '5000', hargaJualPenyalur: '5700', hargaJual: '6500' },
      { sku: 'MYR-TRS-200', nama: 'Torres 200ml', idPemasok: pMayora.id, satuan: 'Botol', hargaTebus: '4200', hargaJualPenyalur: '4900', hargaJual: '5800' },
      // Kalbe — harga per botol
      { sku: 'KLB-KRT-250', nama: 'Kiranti 250ml', idPemasok: pKalbe.id, satuan: 'Botol', hargaTebus: '5000', hargaJualPenyalur: '5800', hargaJual: '6500' },
      { sku: 'KLB-FTG-150', nama: 'Fatigon Spirit 150ml', idPemasok: pKalbe.id, satuan: 'Botol', hargaTebus: '3800', hargaJualPenyalur: '4500', hargaJual: '5200' },
      { sku: 'KLB-PRM-100', nama: 'Promag Syrup 100ml', idPemasok: pKalbe.id, satuan: 'Botol', hargaTebus: '3200', hargaJualPenyalur: '3800', hargaJual: '4500' },
      // Coca-Cola — harga per botol
      { sku: 'CCL-COLA-390', nama: 'Coca-Cola 390ml', idPemasok: pCoca.id, satuan: 'Botol', hargaTebus: '4500', hargaJualPenyalur: '5200', hargaJual: '6000' },
      { sku: 'CCL-SPR-390', nama: 'Sprite 390ml', idPemasok: pCoca.id, satuan: 'Botol', hargaTebus: '4500', hargaJualPenyalur: '5200', hargaJual: '6000' },
      { sku: 'CCL-FAN-390', nama: 'Fanta Strawberry 390ml', idPemasok: pCoca.id, satuan: 'Botol', hargaTebus: '4500', hargaJualPenyalur: '5200', hargaJual: '6000' },
      // Sosro — harga per botol
      { sku: 'SOS-TBS-350', nama: 'Teh Botol Sosro 350ml', idPemasok: pSosro.id, satuan: 'Botol', hargaTebus: '3500', hargaJualPenyalur: '4200', hargaJual: '5000' },
      { sku: 'SOS-FTM-350', nama: 'Fruit Tea Markisa 350ml', idPemasok: pSosro.id, satuan: 'Botol', hargaTebus: '3500', hargaJualPenyalur: '4200', hargaJual: '5000' },
      // Ultra Jaya — harga per kotak
      { sku: 'ULT-UMF-250', nama: 'Ultra Milk Full Cream 250ml', idPemasok: pUltra.id, satuan: 'Kotak', hargaTebus: '5000', hargaJualPenyalur: '5700', hargaJual: '6500' },
      { sku: 'ULT-UMC-250', nama: 'Ultra Milk Coklat 250ml', idPemasok: pUltra.id, satuan: 'Kotak', hargaTebus: '5000', hargaJualPenyalur: '5700', hargaJual: '6500' },
      { sku: 'ULT-SBJ-250', nama: 'Ultra Sari Buah Jambu 250ml', idPemasok: pUltra.id, satuan: 'Kotak', hargaTebus: '4500', hargaJualPenyalur: '5200', hargaJual: '6000' },
      // Yakult — harga per botol
      { sku: 'YKT-ORI-65', nama: 'Yakult Original 65ml', idPemasok: pYakult.id, satuan: 'Botol', hargaTebus: '1700', hargaJualPenyalur: '1900', hargaJual: '2200' },
      // Indofood — harga per botol
      { sku: 'IND-ICO-350', nama: 'Ichi Ocha 350ml', idPemasok: pIndofood.id, satuan: 'Botol', hargaTebus: '3200', hargaJualPenyalur: '3800', hargaJual: '4500' },
      { sku: 'IND-TSK-300', nama: 'Teh Sarikoe 300ml', idPemasok: pIndofood.id, satuan: 'Botol', hargaTebus: '2800', hargaJualPenyalur: '3300', hargaJual: '4000' },
      // PepsiCo — harga per botol
      { sku: 'PEP-COLA-390', nama: 'Pepsi Cola 390ml', idPemasok: pPepsi.id, satuan: 'Botol', hargaTebus: '4200', hargaJualPenyalur: '4900', hargaJual: '5800' },
      { sku: 'PEP-MIR-390', nama: 'Mirinda Orange 390ml', idPemasok: pPepsi.id, satuan: 'Botol', hargaTebus: '4200', hargaJualPenyalur: '4900', hargaJual: '5800' },
      // Jamu Jago
      { sku: 'JGO-KBE-100', nama: 'Kuku Bima Ener-G 100ml', idPemasok: pJago.id, satuan: 'Botol', hargaTebus: '2500', hargaJualPenyalur: '3000', hargaJual: '3500' },
      { sku: 'JGO-TAG-15', nama: 'Tolak Angin 15ml', idPemasok: pJago.id, satuan: 'Sachet', hargaTebus: '1200', hargaJualPenyalur: '1400', hargaJual: '1700' },
    ];
    await db.insert(schema.produk).values(produkData.map(p => ({ ...p, apakahAktif: 1 })));
    const produk = await db.select().from(schema.produk).orderBy(sql`id`);

    // ═══════════════════════════════════════════
    //  4. PENGUNA
    // ═══════════════════════════════════════════
    console.log('Seeding pengguna...');
    await db.insert(schema.pengguna).values([
      { nama: 'Admin Pusat', email: 'admin@sikons.com', passwordHash: hashed, peran: 'penyalur', apakahAktif: 1 },
      { nama: 'Rudi Sales', email: 'rudi@sikons.com', passwordHash: hashed, peran: 'sales', apakahAktif: 1 },
      { nama: 'Sari Sales', email: 'sari@sikons.com', passwordHash: hashed, peran: 'sales', apakahAktif: 1 },
      { nama: 'Budi Mitra', email: 'budi@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Ani Mitra', email: 'ani@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Citra Mitra', email: 'citra@sikons.com', passwordHash: hashed, peran: 'mitra', apakahAktif: 1 },
      { nama: 'Supplier Wings', email: 'wings@sikons.com', passwordHash: hashed, peran: 'pemasok', idPemasok: pWings.id, apakahAktif: 1 },
      { nama: 'Supplier Mayora', email: 'mayora@sikons.com', passwordHash: hashed, peran: 'pemasok', idPemasok: pMayora.id, apakahAktif: 1 },
    ]);
    const [admin, salesRudi, salesSari, ...restUsers] = await db.select().from(schema.pengguna).orderBy(sql`id`);

    // ═══════════════════════════════════════════
    //  5. MITRA (3)
    // ═══════════════════════════════════════════
    console.log('Seeding mitra...');
    await db.insert(schema.mitra).values([
      { nama: 'Toko Budi', namaPemilik: 'Budi Santoso', telepon: '081234567890', lat: '-6.914744', lng: '107.609810', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Warung Ani', namaPemilik: 'Ani Rahmawati', telepon: '089876543210', lat: '-6.920000', lng: '107.610000', idSalesDitugaskan: salesRudi.id, apakahAktif: 1 },
      { nama: 'Kios Citra', namaPemilik: 'Citra Dewi', telepon: '085711223344', lat: '-7.250000', lng: '112.750000', idSalesDitugaskan: salesSari.id, apakahAktif: 1 },
    ]);
    const [mitraBudi, mitraAni, mitraCitra] = await db.select().from(schema.mitra).orderBy(sql`id`);
    await db.update(schema.pengguna).set({ idMitra: mitraBudi.id }).where(sql`id = ${restUsers[0].id}`);
    await db.update(schema.pengguna).set({ idMitra: mitraAni.id }).where(sql`id = ${restUsers[1].id}`);
    await db.update(schema.pengguna).set({ idMitra: mitraCitra.id }).where(sql`id = ${restUsers[2].id}`);

    const userBudi = restUsers[0];
    const userAni = restUsers[1];
    const userCitra = restUsers[2];

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
    //  7. PENERIMAAN BARANG (6 GR)
    // ═══════════════════════════════════════════
    console.log('Seeding penerimaan barang...');

    interface GRItem { produkIdx: number; jumlah: number; hargaTebusAktual: string }

    const grData: { nomor: string; pemasok: typeof pWings; gudang: typeof gPusat; tgl: Date; items: GRItem[]; status: 'draft' | 'completed' }[] = [
      {
        nomor: 'GR-20260601-0001', pemasok: pWings, gudang: gPusat, tgl: new Date('2026-06-01'), status: 'completed',
        items: [
          { produkIdx: 0, jumlah: 80, hargaTebusAktual: '4000' },
          { produkIdx: 1, jumlah: 70, hargaTebusAktual: '4000' },
          { produkIdx: 2, jumlah: 60, hargaTebusAktual: '3500' },
        ],
      },
      {
        nomor: 'GR-20260602-0001', pemasok: pMayora, gudang: gPusat, tgl: new Date('2026-06-02'), status: 'completed',
        items: [
          { produkIdx: 3, jumlah: 70, hargaTebusAktual: '4500' },
          { produkIdx: 4, jumlah: 60, hargaTebusAktual: '5000' },
          { produkIdx: 5, jumlah: 50, hargaTebusAktual: '4200' },
        ],
      },
      {
        nomor: 'GR-20260605-0001', pemasok: pCoca, gudang: gBandung, tgl: new Date('2026-06-05'), status: 'completed',
        items: [
          { produkIdx: 9, jumlah: 60, hargaTebusAktual: '4500' },
          { produkIdx: 10, jumlah: 50, hargaTebusAktual: '4500' },
          { produkIdx: 11, jumlah: 50, hargaTebusAktual: '4500' },
        ],
      },
      {
        nomor: 'GR-20260607-0001', pemasok: pSosro, gudang: gBandung, tgl: new Date('2026-06-07'), status: 'draft',
        items: [
          { produkIdx: 12, jumlah: 70, hargaTebusAktual: '3500' },
          { produkIdx: 13, jumlah: 60, hargaTebusAktual: '3500' },
        ],
      },
      {
        nomor: 'GR-20260610-0001', pemasok: pUltra, gudang: gSurabaya, tgl: new Date('2026-06-10'), status: 'draft',
        items: [
          { produkIdx: 14, jumlah: 60, hargaTebusAktual: '5000' },
          { produkIdx: 15, jumlah: 50, hargaTebusAktual: '5000' },
          { produkIdx: 16, jumlah: 40, hargaTebusAktual: '4500' },
        ],
      },
      {
        nomor: 'GR-20260612-0001', pemasok: pIndofood, gudang: gPusat, tgl: new Date('2026-06-12'), status: 'draft',
        items: [
          { produkIdx: 18, jumlah: 70, hargaTebusAktual: '3200' },
          { produkIdx: 19, jumlah: 60, hargaTebusAktual: '2800' },
        ],
      },
    ];

    for (const gr of grData) {
      await db.insert(schema.penerimaanBarang).values([{
        nomorPenerimaan: gr.nomor, idPemasok: gr.pemasok.id, idGudang: gr.gudang.id,
        diterimaOleh: admin.id, tanggalPenerimaan: gr.tgl, status: gr.status,
      }]);
      const [header] = await db.select().from(schema.penerimaanBarang).where(sql`nomor_penerimaan = ${gr.nomor}`);
      for (const item of gr.items) {
        const prod = produk[item.produkIdx];
        await db.insert(schema.itemPenerimaanBarang).values([{
          idPenerimaan: header.id, idProduk: prod.id, jumlah: item.jumlah,
          hargaTebusAktual: item.hargaTebusAktual,
        }]);
        if (gr.status === 'completed') {
          await db.update(schema.stokGudang)
            .set({ jumlah: sql`jumlah + ${item.jumlah}`, diperbaruiPada: sql`CURRENT_TIMESTAMP` })
            .where(sql`id_gudang = ${gr.gudang.id} AND id_produk = ${prod.id}`);
          addStock(gr.gudang.id, prod.id, item.jumlah);
        }
      }
    }

    // ═══════════════════════════════════════════
    //  8. PENYALURAN + FAKTUR (6 DEL)
    // ═══════════════════════════════════════════
    console.log('Seeding penyaluran & faktur...');

    interface DELItem { produkIdx: number; jumlahDikirim: number }

    const delData: {
      nomor: string; gudang: typeof gPusat; mitra: typeof mitraBudi; sales: typeof salesRudi; tgl: Date; status: string;
      items: DELItem[]
    }[] = [
      {
        nomor: 'DEL-20260604-0001', gudang: gPusat, mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-04'), status: 'received',
        items: [
          { produkIdx: 0, jumlahDikirim: 30 }, // Floridina Orange
          { produkIdx: 3, jumlahDikirim: 20 }, // Kopiko 78
          { produkIdx: 18, jumlahDikirim: 25 }, // Ichi Ocha
        ],
      },
      {
        nomor: 'DEL-20260606-0001', gudang: gPusat, mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-06'), status: 'received',
        items: [
          { produkIdx: 1, jumlahDikirim: 25 }, // Floridina Lychee
          { produkIdx: 4, jumlahDikirim: 20 }, // Kopiko Blister
          { produkIdx: 19, jumlahDikirim: 20 }, // Teh Sarikoe
        ],
      },
      {
        nomor: 'DEL-20260608-0001', gudang: gBandung, mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-08'), status: 'sent',
        items: [
          { produkIdx: 9, jumlahDikirim: 20 }, // Coca-Cola
          { produkIdx: 12, jumlahDikirim: 25 }, // Teh Botol Sosro
          { produkIdx: 13, jumlahDikirim: 15 }, // Fruit Tea
        ],
      },
      {
        nomor: 'DEL-20260611-0001', gudang: gPusat, mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-11'), status: 'sent',
        items: [
          { produkIdx: 0, jumlahDikirim: 20 }, // Floridina Orange
          { produkIdx: 5, jumlahDikirim: 15 }, // Torres
          { produkIdx: 18, jumlahDikirim: 15 }, // Ichi Ocha
        ],
      },
      {
        nomor: 'DEL-20260615-0001', gudang: gBandung, mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-15'), status: 'draft',
        items: [
          { produkIdx: 9, jumlahDikirim: 15 }, // Coca-Cola
          { produkIdx: 10, jumlahDikirim: 10 }, // Sprite
          { produkIdx: 11, jumlahDikirim: 10 }, // Fanta
        ],
      },
      {
        nomor: 'DEL-20260618-0001', gudang: gSurabaya, mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-18'), status: 'draft',
        items: [
          { produkIdx: 14, jumlahDikirim: 20 }, // Ultra Milk Full Cream
          { produkIdx: 15, jumlahDikirim: 15 }, // Ultra Milk Coklat
        ],
      },
    ];

    for (const del of delData) {
      await db.insert(schema.penyaluran).values([{
        nomorPenyaluran: del.nomor, idGudangAsal: del.gudang.id, idMitra: del.mitra.id,
        idSales: del.sales.id, tanggalPenyaluran: del.tgl, status: del.status, dibuatOleh: admin.id,
      }]);
      const [header] = await db.select().from(schema.penyaluran).where(sql`nomor_penyaluran = ${del.nomor}`);
      for (const item of del.items) {
        const prod = produk[item.produkIdx];
        await db.insert(schema.itemPenyaluran).values([{
          idPenyaluran: header.id, idProduk: prod.id, jumlahDikirim: item.jumlahDikirim,
          snapshotHargaJual: prod.hargaJual, snapshotHargaTebus: prod.hargaTebus,
        }]);
        if (del.status !== 'draft') {
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
    }

    // Faktur — hanya untuk penyaluran dengan status 'received' atau 'sent'
    const [del1, del2, del3, ..._] = await db.select().from(schema.penyaluran).orderBy(sql`id`);
    const fakturItems = [
      { del: del1, nomor: 'INV-2026-0001' },
      { del: del2, nomor: 'INV-2026-0002' },
      { del: del3, nomor: 'INV-2026-0003' },
    ];
    for (const f of fakturItems) {
      const items = await db.select().from(schema.itemPenyaluran).where(sql`id_penyaluran = ${f.del.id}`);
      const total = items.reduce((sum, it) => sum + Number(it.jumlahDikirim) * Number(it.snapshotHargaJual), 0);
      await db.insert(schema.faktur).values([{
        nomorFaktur: f.nomor, idPenyaluran: f.del.id,
        totalNilai: String(total), diterbitkanPada: f.del.tanggalPenyaluran,
      }]);
    }

    // ═══════════════════════════════════════════
    //  9. OPNAME STOK (6 opname)
    // ═══════════════════════════════════════════
    console.log('Seeding opname stok...');

    interface OPData {
      nomor: string; mitra: typeof mitraBudi; sales: typeof salesRudi; tgl: Date; status: string;
      items: { produkIdx: number; stokAwal: number; laku: number; retur: number; kondisi: string | null; anomali?: number }[]
    }

    const opData: OPData[] = [
      {
        nomor: 'OP-20260611-0001', mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-11'), status: 'verified',
        items: [
          { produkIdx: 0, stokAwal: 30, laku: 18, retur: 2, kondisi: 'good' },
          { produkIdx: 3, stokAwal: 20, laku: 12, retur: 1, kondisi: 'good' },
          { produkIdx: 18, stokAwal: 25, laku: 20, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260613-0001', mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-13'), status: 'verified',
        items: [
          { produkIdx: 1, stokAwal: 25, laku: 15, retur: 3, kondisi: 'expired' },
          { produkIdx: 4, stokAwal: 20, laku: 12, retur: 2, kondisi: 'damaged' },
          { produkIdx: 19, stokAwal: 20, laku: 14, retur: 1, kondisi: 'good' },
        ],
      },
      {
        nomor: 'OP-20260614-0001', mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-14'), status: 'verified',
        items: [
          { produkIdx: 9, stokAwal: 20, laku: 10, retur: 2, kondisi: 'good' },
          { produkIdx: 12, stokAwal: 25, laku: 18, retur: 1, kondisi: 'good' },
          { produkIdx: 13, stokAwal: 15, laku: 8, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260618-0001', mitra: mitraBudi, sales: salesRudi,
        tgl: new Date('2026-06-18'), status: 'submitted',
        items: [
          { produkIdx: 0, stokAwal: 10, laku: 6, retur: 1, kondisi: 'good' },
          { produkIdx: 5, stokAwal: 15, laku: 8, retur: 2, kondisi: 'good' },
          { produkIdx: 18, stokAwal: 5, laku: 4, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260620-0001', mitra: mitraAni, sales: salesRudi,
        tgl: new Date('2026-06-20'), status: 'submitted',
        items: [
          { produkIdx: 1, stokAwal: 7, laku: 4, retur: 1, kondisi: 'damaged' },
          { produkIdx: 4, stokAwal: 6, laku: 4, retur: 0, kondisi: null },
        ],
      },
      {
        nomor: 'OP-20260622-0001', mitra: mitraCitra, sales: salesSari,
        tgl: new Date('2026-06-22'), status: 'submitted',
        items: [
          { produkIdx: 9, stokAwal: 8, laku: 5, retur: 1, kondisi: 'good' },
          { produkIdx: 12, stokAwal: 6, laku: 4, retur: 2, kondisi: 'expired' },
          { produkIdx: 13, stokAwal: 7, laku: 5, retur: 0, kondisi: null },
          { produkIdx: 11, stokAwal: 10, laku: -1, retur: 0, kondisi: null, anomali: 1 },
        ],
      },
    ];

    for (const op of opData) {
      const hasAnomali = op.items.some(it => it.anomali === 1 || (it.stokAwal - it.laku - it.retur < 0));
      await db.insert(schema.opnameStok).values([{
        nomorOpname: op.nomor, idMitra: op.mitra.id, idSales: op.sales.id,
        tanggalKunjungan: op.tgl, status: op.status, memilikiAnomali: hasAnomali ? 1 : 0, dibuatOleh: op.sales.id,
      }]);
      const [oh] = await db.select().from(schema.opnameStok).where(sql`nomor_opname = ${op.nomor}`);
      for (const it of op.items) {
        const prod = produk[it.produkIdx];
        const stokFisik = Math.max(0, it.stokAwal - it.laku - it.retur);
        const anomali = it.anomali === 1 || stokFisik < 0 ? 1 : 0;
        await db.insert(schema.itemOpname).values([{
          idOpname: oh.id, idProduk: prod.id, stokAwal: it.stokAwal,
          jumlahLaku: it.laku, jumlahRetur: it.retur, stokFisik: Math.max(0, stokFisik),
          kondisiRetur: it.kondisi, apakahAnomali: anomali,
        }]);
      }
    }

    // ═══════════════════════════════════════════
    //  10. PERMINTAAN RESTOK
    // ═══════════════════════════════════════════
    console.log('Seeding permintaan restok...');

    await db.insert(schema.permintaanStok).values([
      { nomorPermintaan: 'RR-20260616-0001', idMitra: mitraBudi.id, dimintaOleh: userBudi.id, status: 'approved', disetujuiOleh: admin.id },
      { nomorPermintaan: 'RR-20260619-0001', idMitra: mitraAni.id, dimintaOleh: userAni.id, status: 'pending' },
      { nomorPermintaan: 'RR-20260621-0001', idMitra: mitraCitra.id, dimintaOleh: salesSari.id, status: 'pending' },
    ]);
    const [rr1, rr2, rr3] = await db.select().from(schema.permintaanStok).orderBy(sql`id`);

    await db.insert(schema.itemPermintaanStok).values([
      { idPermintaan: rr1.id, idProduk: produk[0].id, jumlahDiminta: 30, jumlahDisetujui: 30 },
      { idPermintaan: rr1.id, idProduk: produk[3].id, jumlahDiminta: 20, jumlahDisetujui: 20 },
      { idPermintaan: rr1.id, idProduk: produk[18].id, jumlahDiminta: 25, jumlahDisetujui: 20 },
      { idPermintaan: rr2.id, idProduk: produk[1].id, jumlahDiminta: 20 },
      { idPermintaan: rr2.id, idProduk: produk[4].id, jumlahDiminta: 15 },
      { idPermintaan: rr2.id, idProduk: produk[19].id, jumlahDiminta: 15 },
      { idPermintaan: rr3.id, idProduk: produk[9].id, jumlahDiminta: 15 },
      { idPermintaan: rr3.id, idProduk: produk[12].id, jumlahDiminta: 20 },
      { idPermintaan: rr3.id, idProduk: produk[14].id, jumlahDiminta: 15 },
    ]);

    // ═══════════════════════════════════════════
    //  11. PREDIKSI STOK
    // ═══════════════════════════════════════════
    console.log('Seeding prediksi stok...');

    // Predictions based on average laku from opname data
    await db.insert(schema.prediksiStok).values([
      // Toko Budi
      { idMitra: mitraBudi.id, idProduk: produk[0].id, jumlahPrediksi: 12, rataRataLaku: '12.00', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      { idMitra: mitraBudi.id, idProduk: produk[3].id, jumlahPrediksi: 12, rataRataLaku: '12.00', berdasarkanKunjungan: 1, dihasilkanPada: new Date() },
      { idMitra: mitraBudi.id, idProduk: produk[18].id, jumlahPrediksi: 12, rataRataLaku: '12.00', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      // Warung Ani
      { idMitra: mitraAni.id, idProduk: produk[1].id, jumlahPrediksi: 10, rataRataLaku: '9.50', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      { idMitra: mitraAni.id, idProduk: produk[4].id, jumlahPrediksi: 8, rataRataLaku: '8.00', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      { idMitra: mitraAni.id, idProduk: produk[19].id, jumlahPrediksi: 14, rataRataLaku: '14.00', berdasarkanKunjungan: 1, dihasilkanPada: new Date() },
      // Kios Citra
      { idMitra: mitraCitra.id, idProduk: produk[9].id, jumlahPrediksi: 8, rataRataLaku: '7.50', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      { idMitra: mitraCitra.id, idProduk: produk[12].id, jumlahPrediksi: 11, rataRataLaku: '11.00', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
      { idMitra: mitraCitra.id, idProduk: produk[13].id, jumlahPrediksi: 7, rataRataLaku: '6.50', berdasarkanKunjungan: 2, dihasilkanPada: new Date() },
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
    const [predCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.prediksiStok);

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
    console.log(`  • ${predCount.count} prediksi stok`);
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
        lastGudang.nama = s.gudang;
      }
      console.log(`    • ${s.produk}: ${s.jumlah}`);
    }

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await connection.end();
  }
}

import { eq } from 'drizzle-orm';
main();
