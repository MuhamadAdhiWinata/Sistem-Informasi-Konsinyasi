# BAB 4 — IMPLEMENTASI DAN PEMBAHASAN

---

## 4.1 Implementasi dan Uji Coba Sistem

Bab ini menguraikan implementasi Sistem Informasi Konsinyasi (SIKONS) berdasarkan rancangan yang telah dijelaskan pada Bab 3. Implementasi mencakup enam modul utama yang dibangun menggunakan Nuxt 3, TypeScript, Drizzle ORM, dan MariaDB. Setiap sub-bab menyajikan potongan kode inti, hasil implementasi antarmuka, serta pengujian fungsional berdasarkan skenario penggunaan nyata.

### 4.1.1 Autentikasi dan Role-Based Access Control (RBAC)

**Implementasi**

Autentikasi sistem menggunakan JWT (JSON Web Token) yang diterbitkan saat pengguna berhasil login. Token berisi payload berupa `id`, `email`, `peran`, `idMitra`, dan `idPemasok` yang digunakan untuk mengidentifikasi dan mengotorisasi pengguna di setiap permintaan API.

Berikut adalah implementasi fungsi utilitas RBAC yang digunakan di seluruh route API untuk memeriksa hak akses pengguna berdasarkan perannya.

```typescript
// server/utils/rbac.ts
export const requireRole = (event: H3Event, allowedRoles: string[]) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No user context found',
    });
  }

  if (user.peran === 'penyalur') {
    return;
  }

  if (!allowedRoles.includes(user.peran)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`,
    });
  }
};
```

Fungsi `requireRole` dipanggil di setiap route API untuk memvalidasi apakah peran pengguna yang sedang aktif diizinkan mengakses endpoint tertentu. Pengguna dengan peran `penyalur` memiliki akses penuh ke seluruh sistem tanpa pengecualian.

Pada sisi klien, komposabel `useAuth` mengelola state autentikasi dan menyediakan properti komputasi untuk setiap peran.

```typescript
// composables/useAuth.ts
const token = ref<string | null>(null);
const user = ref<AuthUser | null>(null);

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);
  const isPenyalur = computed(() => user.value?.peran === 'penyalur');
  const isSales = computed(() => user.value?.peran === 'sales');
  const isMitra = computed(() => user.value?.peran === 'mitra');
  const isPemasok = computed(() => user.value?.peran === 'pemasok');

  function init() {
    if (!isClient()) return;
    const stored = localStorage.getItem('sikons_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        token.value = parsed.token;
        user.value = parsed.user;
      } catch {
        localStorage.removeItem('sikons_auth');
      }
    }
  }

  async function login(email: string, password: string) {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const { token: t, user: u } = res.data || res;
    token.value = t;
    user.value = u;
    if (isClient()) {
      localStorage.setItem('sikons_auth', JSON.stringify({ token: t, user: u }));
    }
    return { token: t, user: u };
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (isClient()) {
      localStorage.removeItem('sikons_auth');
    }
  }

  return { token, user, isLoggedIn, isPenyalur, isSales, isMitra, isPemasok,
           init, login, logout };
}
```

**Hasil Uji Coba**

[GAMBAR: Halaman login SIKONS dengan input email dan password]

| Skenario | Input | Hasil Diharapkan | Hasil |
|:---------|:------|:-----------------|:------|
| Login berhasil | Email dan password valid | Redirect ke dashboard, token tersimpan | ✅ |
| Login gagal | Email tidak terdaftar | Pesan error "Email atau password salah" | ✅ |
| Login gagal | Password salah | Pesan error "Email atau password salah" | ✅ |
| Login akun nonaktif | Akun dengan `apakah_aktif = 0` | Pesan error "Akun Anda tidak aktif" | ✅ |
| Akses tanpa token | Request API tanpa header Authorization | 401 Unauthorized | ✅ |
| Akses role terlarang | Sales akses endpoint rekonsiliasi | 403 Forbidden | ✅ |

[GAMBAR: Sidebar navigasi yang berbeda untuk peran Penyalur (full menu) vs Mitra (menu terbatas)]

### 4.1.2 Skema Basis Data dengan Drizzle ORM

**Implementasi**

Skema basis data didefinisikan menggunakan Drizzle ORM dalam file TypeScript. Setiap tabel direpresentasikan sebagai satu file yang mendefinisikan kolom, tipe data, kunci utama, dan referensi kunci asing. Berikut adalah contoh skema untuk tabel `produk` yang memiliki tiga tingkat harga.

```typescript
// server/database/schema/produk.ts
import { bigint, decimal, mysqlTable, text, tinyint, varchar }
  from 'drizzle-orm/mysql-core';
import { pemasok } from './pemasok';

export const produk = mysqlTable('produk', {
  id:          bigint('id', { mode: 'number', unsigned: true })
                 .autoincrement().primaryKey(),
  sku:         varchar('sku', { length: 50 }).notNull().unique(),
  nama:        varchar('nama', { length: 150 }).notNull(),
  idPemasok:   bigint('id_pemasok', { mode: 'number', unsigned: true })
                 .notNull().references(() => pemasok.id),
  satuan:      varchar('satuan', { length: 20 }).notNull(),
  hargaPabrik:  decimal('harga_pabrik', { precision: 12, scale: 2 }).notNull(),
  hargaGrosir: decimal('harga_grosir', { precision: 12, scale: 2 }).notNull(),
  hargaRetail:   decimal('harga_retail', { precision: 12, scale: 2 }).notNull(),
  gambar:      text('gambar'),
  apakahAktif: tinyint('apakah_aktif').notNull().default(1),
});
```

Tipe data `decimal(12,2)` digunakan untuk ketiga level harga guna memastikan presisi kalkulasi keuangan. Kolom `sku` bersifat unik sebagai identitas produk. Relasi ke tabel `pemasok` didefinisikan secara deklaratif melalui method `.references(() => pemasok.id)`, yang secara otomatis membuat kunci asing di tingkat basis data. Seluruh 15 tabel didefinisikan dengan pola yang sama dan diekspor melalui barrel file `index.ts` untuk digunakan oleh seluruh bagian aplikasi.

### 4.1.3 Master Data

**Implementasi**

Modul Master Data mencakup operasi CRUD untuk lima entitas: pemasok, produk, mitra, gudang, dan pengguna. Setiap entitas memiliki route API RESTful dengan pola `GET /api/[entitas]` untuk daftar, `POST /api/[entitas]` untuk tambah, `GET /api/[entitas]/:id` untuk detail, `PUT /api/[entitas]/:id` untuk ubah, dan `DELETE /api/[entitas]/:id` untuk hapus.

Validasi input menggunakan Zod yang dilakukan di sisi server melalui `readValidatedBody`. Setiap route juga dilindungi oleh fungsi `requireRole` untuk memastikan hanya pengguna dengan peran yang sesuai yang dapat mengaksesnya. Khusus modul Master Data, hanya peran `penyalur` yang memiliki akses CRUD penuh. Peran `sales` dan `pemasok` hanya dapat membaca data.

**Hasil Uji Coba**

| Modul | Skenario | Hasil |
|:------|:---------|:------|
| Pemasok | Penyalur membuat, mengubah, menghapus pemasok | ✅ |
| Produk | Penyalur membuat produk dengan SKU unik dan tiga harga | ✅ |
| Mitra | Penyalur membuat mitra dengan GPS dan assign sales | ✅ |
| Gudang | Penyalur membuat gudang dengan kode unik | ✅ |
| Pengguna | Penyalur membuat pengguna dengan 4 peran berbeda | ✅ |
| Sales | Sales hanya melihat daftar (tanpa tombol tambah/hapus) | ✅ |

[GAMBAR: Halaman daftar produk dengan kolom SKU, nama, pemasok, harga pabrik, grosir, retail]

[GAMBAR: Form tambah produk dengan input SKU, nama, pemasok, satuan, tiga tingkat harga]

### 4.1.4 Penerimaan Barang

**Implementasi**

Modul Penerimaan Barang menerapkan alur kerja dua status: `draft` (pembuatan awal) dan `completed` (konfirmasi). Operasi paling kritis adalah saat konfirmasi, di mana stok gudang ditambah dalam satu transaksi basis data atomik.

```typescript
// server/api/penerimaan-barang/[id].patch.ts
import { eq, and, sql } from 'drizzle-orm';
import { penerimaanBarang, itemPenerimaanBarang, stokGudang }
  from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  requireRole(event, ['penyalur']);
  const id = Number(getRouterParam(event, 'id'));

  // Validasi status: hanya draft yang bisa dikonfirmasi
  const existing = await db.select()
    .from(penerimaanBarang)
    .where(eq(penerimaanBarang.id, id)).limit(1);

  if (!existing.length)
    throw createError({ statusCode: 404 });
  if (existing[0].status === 'completed')
    throw createError({ statusCode: 400,
      statusMessage: 'Penerimaan sudah selesai sebelumnya' });

  // Transaksi atomik: update status + update stok gudang
  await db.transaction(async (tx) => {
    await tx.update(penerimaanBarang)
      .set({ status: 'completed' })
      .where(eq(penerimaanBarang.id, id));

    const items = await tx.select()
      .from(itemPenerimaanBarang)
      .where(eq(itemPenerimaanBarang.idPenerimaan, id));

    for (const item of items) {
      const stock = await tx.select().from(stokGudang)
        .where(and(eq(stokGudang.idGudang, existing[0].idGudang),
                   eq(stokGudang.idProduk, item.idProduk)))
        .limit(1);

      if (stock.length) {
        await tx.update(stokGudang)
          .set({ jumlah: sql`${stokGudang.jumlah} + ${item.jumlah}`,
                 diperbaruiPada: sql`CURRENT_TIMESTAMP` })
          .where(eq(stokGudang.id, stock[0].id));
      } else {
        await tx.insert(stokGudang)
          .values({ idGudang: existing[0].idGudang,
                    idProduk: item.idProduk, jumlah: item.jumlah });
      }
    }
  });

  return { message: 'Penerimaan dikonfirmasi, stok gudang diperbarui' };
});
```

Logika `INSERT ... ON DUPLICATE KEY UPDATE` diimplementasikan dengan memeriksa keberadaan stok terlebih dahulu. Jika stok untuk kombinasi gudang dan produk sudah ada, nilai `jumlah` ditambahkan. Jika belum, baris baru dibuat. Transaksi basis data memastikan bahwa jika salah satu operasi gagal, seluruh perubahan dibatalkan (rollback).

**Hasil Uji Coba**

[GAMBAR: Form create penerimaan barang dengan pilihan pemasok, gudang, tanggal, dan daftar item]

[GAMBAR: Halaman detail penerimaan dengan status "completed" dan tombol konfirmasi yang sudah dinonaktifkan]

| Skenario | Hasil |
|:---------|:------|
| Membuat penerimaan draft dengan 3 item produk | ✅ |
| Mengkonfirmasi draft → stok gudang bertambah sesuai jumlah item | ✅ |
| Mengkonfirmasi penerimaan yang sudah completed → error 400 | ✅ |
| Sales membuat penerimaan (create only) | ✅ |
| Edit/hapus hanya untuk status draft | ✅ |

### 4.1.5 Penyaluran dan Faktur

**Implementasi**

Modul Penyaluran menerapkan alur kerja tiga status: `draft`, `sent`, dan `received`. Saat status diubah menjadi `sent`, sistem secara atomik mengurangi stok gudang, membuat faktur titip jual dengan nomor otomatis `INV-YYYY-NNNN`, dan menghitung total nilai faktur.

```typescript
// server/api/penyaluran/index.post.ts (potongan inti transaksi)
import { sql } from 'drizzle-orm';
import { penyaluran, itemPenyaluran, faktur } from '~~/server/database/schema';

const year = new Date().getFullYear();
const invCount = await tx
  .select({ count: sql<number>`count(*)` })
  .from(faktur)
  .where(sql`YEAR(diterbitkan_pada) = ${year}`);
const invSeq = String((invCount[0]?.count || 0) + 1).padStart(4, '0');
const nomorFaktur = `INV-${year}-${invSeq}`;

await tx.insert(faktur).values({
  nomorFaktur,
  idPenyaluran,
  totalNilai: String(totalNilai),
  urlPdf: `/penyaluran/${idPenyaluran}/print`,
  diterbitkanPada: new Date(),
});
```

Nomor faktur mengikuti format `INV-YYYY-NNNN` dengan urutan yang di-reset setiap tahun. Total nilai faktur dihitung dari `Σ (jumlahDikirim × snapshotHargaRetail)` untuk setiap item dalam penyaluran. Penggunaan `snapshot` harga memastikan bahwa nilai faktur tidak berubah meskipun harga produk diperbarui di kemudian hari.

**Hasil Uji Coba**

[GAMBAR: Form create penyaluran dengan pilihan gudang, mitra, sales, dan daftar item yang menampilkan stok tersedia]

[GAMBAR: Halaman faktur dengan format invoice A4, nomor INV-2026-0001, dan tabel item]

| Skenario | Hasil |
|:---------|:------|
| Membuat penyaluran draft dengan 2 item | ✅ |
| Mengirim penyaluran → stok gudang berkurang | ✅ |
| Faktur otomatis terbit dengan nomor INV-2026-NNNN | ✅ |
| Mencoba kirim dengan stok tidak cukup → error validasi | ✅ |
| Cetak faktur ke PDF | ✅ |
| Konfirmasi received oleh mitra | ✅ |
| Edit/hapus hanya untuk status draft | ✅ |

### 4.1.6 Opname Stok

**Implementasi**

Modul Opname Stok menangani pencatatan kunjungan sales ke mitra. Sistem secara otomatis menghitung `stokFisik` dan mendeteksi anomali jika hasil perhitungan bernilai negatif.

```typescript
// server/api/opname-stok/index.post.ts (potongan inti)
for (const item of body.items) {
  const stokFisik = item.stokAwal - item.jumlahLaku
                    - item.jumlahRetur - (item.hilang || 0);
  const isAnomali = stokFisik < 0 ? 1 : 0;
  if (isAnomali) hasAnomali = true;

  await tx.insert(itemOpname).values({
    idOpname: opnameId,
    idProduk: item.idProduk,
    stokAwal: item.stokAwal,
    jumlahLaku: item.jumlahLaku,
    jumlahRetur: item.jumlahRetur,
    hilang: item.hilang || 0,
    penanggungHilang: item.penanggungHilang || 'penyalur',
    stokFisik: Math.max(0, stokFisik),
    kondisiRetur: item.kondisiRetur || null,
    apakahAnomali: isAnomali,
  });
}

if (hasAnomali) {
  await tx.update(opnameStok)
    .set({ memilikiAnomali: 1 })
    .where(eq(opnameStok.id, opnameId));
}
```

Rumus perhitungan stok fisik: `stokFisik = stokAwal − jumlahLaku − jumlahRetur − hilang`. Jika hasilnya negatif, sistem menandai item tersebut sebagai anomali (`apakahAnomali = 1`) dan mengatur flag `memilikiAnomali = 1` pada header opname. Sistem menggunakan `Math.max(0, stokFisik)` untuk menyimpan nilai stok fisik minimal 0, sementara informasi anomali tetap tercatat untuk keperluan rekonsiliasi.

**Hasil Uji Coba**

[GAMBAR: Form opname stok dengan daftar item produk, input stok awal, laku, retur, dan stok fisik hasil kalkulasi otomatis]

[GAMBAR: Detail opname dengan item anomali yang ditandai warna merah]

| Skenario | Hasil |
|:---------|:------|
| Membuat opname dengan 5 item, input laku dan retur | ✅ |
| Stok fisik terhitung otomatis = stok awal − laku − retur − hilang | ✅ |
| Jika stok fisik < 0 → item ditandai anomali, header memiliki_anomali = 1 | ✅ |
| Sales dan Mitra dapat membuat opname, hanya Penyalur yang verifikasi | ✅ |
| Edit/hapus hanya untuk status draft | ✅ |

### 4.1.7 Rekonsiliasi Keuangan

**Implementasi**

Modul Rekonsiliasi Keuangan menyajikan laporan pendapatan berdasarkan struktur harga tiga tingkat. Perhitungan dilakukan dalam kueri SQL agregasi yang menggabungkan data dari tabel `opname_stok`, `item_opname`, `produk`, dan `mitra`.

```typescript
// server/api/rekonsiliasi-penyalur/index.get.ts (agregasi per mitra)
const rows = await db.select({
  idMitra:            opnameStok.idMitra,
  mitra:              mitra.nama,
  totalLaku:          sql<number>`coalesce(sum(${itemOpname.jumlahLaku}), 0)`,
  totalRetur:         sql<number>`coalesce(sum(${itemOpname.jumlahRetur}), 0)`,
  totalHilang:        sql<number>`coalesce(sum(${itemOpname.hilang}), 0)`,
  returBaik:          sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'good' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
  returRusak:         sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'damaged' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
  returExpired:       sql<number>`coalesce(sum(case when ${itemOpname.kondisiRetur} = 'expired' then ${itemOpname.jumlahRetur} else 0 end), 0)`,
  totalPendapatanMitra:
    sql<number>`coalesce(sum(
      ${itemOpname.jumlahLaku} * (${produk.hargaRetail} - ${produk.hargaGrosir})
      - case when ${itemOpname.penanggungHilang} = 'mitra'
          then ${itemOpname.hilang} * ${produk.hargaGrosir}
          else 0 end
    ), 0)`,
  totalPendapatanPenyalur:
    sql<number>`coalesce(sum(
      ${itemOpname.jumlahLaku} * (${produk.hargaGrosir} - ${produk.hargaPabrik})
      - case when ${itemOpname.penanggungHilang} = 'penyalur'
          then ${itemOpname.hilang} * ${produk.hargaPabrik}
          else 0 end
      + case when ${itemOpname.penanggungHilang} = 'mitra'
          then ${itemOpname.hilang} * (${produk.hargaGrosir} - ${produk.hargaPabrik})
          else 0 end
    ), 0)`,
}).from(opnameStok)
  .innerJoin(mitra, eq(opnameStok.idMitra, mitra.id))
  .innerJoin(itemOpname, eq(itemOpname.idOpname, opnameStok.id))
  .innerJoin(produk, eq(itemOpname.idProduk, produk.id))
  .groupBy(opnameStok.idMitra, mitra.nama);
```

Formula pendapatan yang diterapkan:

1. **Pendapatan Mitra** = `laku × (hargaRetail − hargaGrosir)` − `(jika penanggung = mitra) hilang × hargaGrosir`
2. **Pendapatan Penyalur** = `laku × (hargaGrosir − hargaPabrik)` − `(jika penanggung = penyalur) hilang × hargaPabrik` + `(jika penanggung = mitra) hilang × (hargaGrosir − hargaPabrik)`

Sistem menyediakan dua tampilan terpisah: Rekonsiliasi Penyalur yang menampilkan tiga tingkat harga lengkap, dan Rekonsiliasi Mitra yang hanya menampilkan harga grosir dan retail tanpa data harga pabrik atau laba penyalur.

**Hasil Uji Coba**

[GAMBAR: Dashboard Rekonsiliasi Penyalur dengan tabel per mitra, kolom total laku, retur, pendapatan mitra, pendapatan penyalur]

[GAMBAR: Dashboard Rekonsiliasi Mitra dengan tampilan sederhana yang hanya menampilkan pendapatan mitra]

| Skenario | Hasil |
|:---------|:------|
| Penyalur melihat rekap semua mitra | ✅ |
| Detail per mitra menampilkan data per opname lengkap | ✅ |
| Mitra hanya melihat datanya sendiri tanpa harga pabrik | ✅ |
| Export CSV laporan rekonsiliasi | ✅ |
| Kalkulasi pendapatan sesuai formula tiga tingkat harga | ✅ |
| Barang hilang mengurangi pendapatan sesuai penanggung jawab | ✅ |

### 4.1.8 Request Restock

**Implementasi**

Modul Request Restock memungkinkan Mitra membuat permintaan tambahan stok. Penyalur dapat menyetujui atau menolak permintaan. Saat permintaan disetujui, sistem otomatis membuat draft penyaluran baru yang siap diproses lebih lanjut.

Alur kerja modul ini: Mitra membuat permintaan dengan status `pending` → Penyalur melihat daftar permintaan → Penyalur menyetujui (memilih gudang asal) → Sistem membuat penyaluran draft + faktur → Permintaan berubah status menjadi `approved`. Jika ditolak, status menjadi `rejected`.

**Hasil Uji Coba**

[GAMBAR: Form request restock mitra dengan daftar produk dan jumlah diminta]

[GAMBAR: Panel approval penyalur dengan tombol setujui/tolak dan pilihan gudang asal]

| Skenario | Hasil |
|:---------|:------|
| Mitra membuat permintaan restok dengan 2 produk | ✅ |
| Penyalur melihat daftar permintaan pending | ✅ |
| Penyalur menyetujui → draft penyaluran + faktur terbuat | ✅ |
| Penyalur menolak → status rejected | ✅ |

---

## 4.2 Pembahasan

Hasil implementasi dan pengujian SIKONS menunjukkan bahwa seluruh modul fungsional berjalan sesuai dengan spesifikasi kebutuhan yang telah dirumuskan pada tahap analisis. Pembahasan berikut mengaitkan temuan implementasi dengan tinjauan pustaka dan penelitian terdahulu.

**Autentikasi dan RBAC.** Implementasi RBAC dengan empat peran pengguna pada SIKONS mengacu pada model yang dirumuskan oleh Sandhu et al. (1996). Setiap pengguna ditempatkan dalam satu peran, dan setiap peran memiliki hak akses yang telah ditentukan terhadap sumber daya sistem. Hasil pengujian menunjukkan bahwa fungsi `requireRole` pada middleware server berhasil memblokir akses pengguna ke endpoint yang tidak sesuai dengan perannya. Mekanisme ini sejalan dengan temuan Ferraiolo et al. (2001) bahwa RBAC memberikan kemudahan administrasi keamanan karena perubahan hak akses cukup dilakukan pada level peran, bukan per individu.

**Penerimaan Barang dan Transaksi ACID.** Implementasi transaksi basis data pada modul Penerimaan Barang menggunakan mekanisme `BEGIN TRANSACTION` dan `COMMIT` bawaan Drizzle ORM. Transaksi atomik memastikan bahwa operasi update status dan penambahan stok gudang terjadi secara simultan — jika salah satu gagal, seluruh perubahan dikembalikan (rollback). Hal ini sesuai dengan prinsip Atomicity pada basis data relasional yang dijelaskan oleh Connolly dan Begg (2015). Pendekatan ini juga diterapkan pada modul Penyaluran yang menggabungkan pengurangan stok gudang dan pembuatan faktur dalam satu transaksi.

**Penyaluran dan Faktur Otomatis.** Fitur auto-generate faktur dengan nomor `INV-YYYY-NNNN` menunjukkan bagaimana sistem informasi dapat mengotomatiskan tugas administratif yang sebelumnya dilakukan secara manual. Bantang dan Nugroho (2023) dalam penelitiannya tentang sistem informasi pengelolaan barang dengan Nuxt JS juga menekankan bahwa otomatisasi pencatatan meningkatkan efisiensi dan mengurangi kesalahan data. SIKONS memperluas cakupan otomatisasi ini ke domain konsinyasi dengan format faktur yang sesuai dengan praktik bisnis distribusi di Indonesia.

**Opname Stok dan Deteksi Anomali.** Deteksi anomali stok pada SIKONS bekerja secara otomatis dengan membandingkan stok fisik hasil perhitungan (stok awal − laku − retur − hilang) dengan nilai minimum nol. Anomali ditandai pada level item maupun header opname, sehingga memudahkan identifikasi ketidaksesuaian stok. Fitur ini merupakan jawaban atas permasalahan ketidakakuratan data stok yang diidentifikasi oleh Putri (2024) pada sistem pencatatan manual UMKM. Dengan deteksi anomali otomatis, kesalahan perhitungan atau indikasi kehilangan barang dapat segera diketahui tanpa menunggu rekonsiliasi akhir periode.

**Rekonsiliasi Keuangan Three-Tier Pricing.** Modul Rekonsiliasi Keuangan menerapkan struktur harga tiga tingkat — harga pabrik, harga grosir, dan harga retail — yang lazim dalam praktik distribusi konsinyasi di Indonesia (Utami, 2017). Perhitungan pendapatan mitra dan penyalur dilakukan dalam satu kueri agregasi SQL dengan mempertimbangkan barang hilang dan penanggung jawabnya. Febyanti (2025) menekankan bahwa sistem informasi akuntansi mempercepat proses kerja dan meningkatkan akurasi pelaporan. SIKONS mengimplementasikan prinsip ini melalui laporan rekonsiliasi yang terpisah untuk Penyalur (full three-tier) dan Mitra (simplified), sehingga setiap pihak hanya melihat data yang relevan dengan perannya.

**Perbandingan dengan Penelitian Terdahulu.** Dibandingkan dengan penelitian Fauzan dan Noprisson (2020) yang merancang aplikasi e-commerce jasa titip untuk model B2C, SIKONS menjangkau model B2B dalam rantai distribusi dengan kompleksitas yang lebih tinggi — mencakup workflow multi-status, transaksi stok, rekonsiliasi keuangan, dan kontrol akses multi-peran. Penelitian Repository Universitas Nurul Fikri (2020) tentang sistem titip barang ekspor-impor juga memiliki domain serupa namun belum menyentuh skema konsinyasi dengan harga bertingkat. SIKONS mengisi celah tersebut dengan menyediakan sistem yang mengintegrasikan enam modul dalam satu platform yang saling terhubung secara data.

---

## Daftar Pustaka

Bantang, T. S., & Nugroho, A. (2023). Rancang bangun sistem informasi pengelolaan barang berbasis web menggunakan framework Nuxt JS. *Jurnal Inovtek Polbeng Seri Informatika*, *8*(1), 55–65.

Connolly, T., & Begg, C. (2015). *Database systems: A practical approach to design, implementation, and management* (6th ed.). Pearson.

Fauzan, E., & Noprisson, H. (2020). Analisa & perancangan aplikasi e-commerce jasa titip oleh-oleh produk tradisional. *Jurnal Ilmu Teknik Dan Komputer*, *4*(2), 135–145.

Febyanti, A. (2025). Peran sistem informasi akuntansi dalam rangka meningkatkan kinerja karyawan divisi purchasing di PT Semen Indonesia Distributor. *Jurnal Ekonomi, Koperasi & Kewirausahaan*, *14*(1), 45–58.

Ferraiolo, D. F., Sandhu, R., Gavrila, S., Kuhn, D. R., & Chandramouli, R. (2001). Proposed NIST standard for role-based access control. *ACM Transactions on Information and System Security*, *4*(3), 224–274.

Implementasi sistem informasi pemasaran berbasis web dalam kegiatan jasa titip barang ekspor impor pada bisnis Tourgether.in. (2020). *Repository Universitas Nurul Fikri*.

Putri, A. A. (2024). Perancangan sistem pencatatan transaksi dan pelaporan keuangan menggunakan Google Spreadsheet (Studi Kasus Percetakan Tunas Karya) [D4 thesis, Politeknik Negeri Jakarta]. Repository Politeknik Negeri Jakarta.

Sandhu, R., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). Role-based access control models. *IEEE Computer*, *29*(2), 38–47.

Utami, C. W. (2017). *Manajemen ritel: Strategi dan implementasi operasional bisnis ritel modern* (2nd ed.). Salemba Empat.
