# AGENTS.md — Panduan AI untuk Proyek SIKONS

> File ini adalah panduan wajib bagi semua AI agent (Claude, Gemini, GPT, dll) yang bekerja di repositori ini.
> Baca file ini SEBELUM melakukan tindakan apapun. Ikuti semua aturan di sini tanpa pengecualian.

---

## 1. Identitas Proyek

| Properti | Nilai |
|:---------|:------|
| **Nama** | SIKONS — Sistem Informasi Konsinyasi Terintegrasi |
| **Jenis** | Skripsi / Karya Ilmiah UMKM |
| **PRD** | `PRD_SIKONS_v1.2.md` |
| **Progress** | `progress.md` — WAJIB diperbarui setiap task selesai |
| **ERD** | `sikons_erd_diagram.html` |

## 2. Tech Stack (WAJIB digunakan, JANGAN diganti)

| Layer | Teknologi | Versi |
|:------|:----------|:------|
| **Framework** | Nuxt 3 | ^3.16 |
| **Language** | TypeScript | strict mode |
| **Styling** | Tailwind CSS | via @nuxtjs/tailwindcss |
| **Database** | MariaDB | 10.10 (Docker container: `mariadb_local`) |
| **ORM** | Drizzle ORM | ^0.40 |
| **Validasi** | Zod | ^3.24 |
| **Package Manager** | **pnpm** | 10.x |
| **Auth** | JWT (akan diimplementasi) | — |

## 3. Database

```
Host     : localhost
Port     : 3306
User     : root
Password : rootpassword
Database : SITJ_DB
Container: mariadb_local (Docker)
```

- Cek koneksi: `docker exec mariadb_local mariadb -u root -prootpassword -e "SHOW DATABASES;"`
- Schema Drizzle ada di: `server/database/schema/`
- Migrations ada di: `server/database/migrations/`
- Jalankan migrate: `pnpm db:migrate`
- Generate migration: `pnpm db:generate`

## 4. Struktur Folder Proyek

```
sikons/
├── AGENTS.md               ← File ini
├── PRD_SIKONS_v1.2.md      ← Product Requirements Document
├── progress.md             ← Progress tracker (selalu update!)
├── .env                    ← Environment variables
├── .npmrc                  ← pnpm config (jangan hapus!)
├── nuxt.config.ts
├── drizzle.config.ts
├── package.json
├── tsconfig.json
│
├── assets/css/main.css     ← Global CSS + Tailwind directives
├── composables/            ← Vue composables reusable
├── middleware/             ← Nuxt route middleware (auth, rbac)
├── pages/                  ← File-based routing
│   ├── index.vue           ← Dashboard
│   ├── auth/login.vue
│   └── [modul]/...
├── components/             ← Reusable Vue components
│   └── base/               ← BaseTable, BaseForm, BaseModal, dll
├── layouts/
│   ├── default.vue         ← Layout utama (sidebar + navbar)
│   └── auth.vue            ← Layout login/register
└── server/
    ├── api/                ← Nuxt server routes (REST API)
    │   └── [modul]/        ← Dikelompokkan per modul
    ├── database/
    │   ├── schema/         ← Drizzle schema per tabel (1 file = 1 tabel)
    │   │   ├── index.ts    ← Barrel export semua schema
    │   │   ├── pengguna.ts
    │   │   ├── pemasok.ts
    │   │   └── ...
    │   ├── migrations/     ← Auto-generated oleh drizzle-kit
    │   └── migrate.ts      ← Script runner migrasi
    └── utils/
        ├── database.ts     ← DB connection singleton
        └── auth.ts         ← JWT helpers
```

## 5. Konvensi Penamaan

| Konteks | Konvensi | Contoh |
|:--------|:---------|:-------|
| **File .vue** | kebab-case | `opname-form.vue` |
| **Komponen** | PascalCase | `<OpnameForm />` |
| **File .ts** | kebab-case / snake_case | `stok_gudang.ts` |
| **Nama tabel DB** | Bahasa Indonesia (snake_case) | `opname_stok`, `item_penyaluran` |
| **Kolom DB** | Bahasa Indonesia (snake_case) | `tanggal_kunjungan`, `dibuat_oleh` |
| **API route** | kebab-case | `/api/opname-stok` |
| **Drizzle var** | camelCase (Inggris) | `stockOpnames`, `distributionItems` |

## 6. Peran Pengguna & RBAC

| Peran | Kode Sistem | Akses |
|:------|:------------|:------|
| Admin/Penyalur | `penyalur` | Full access semua modul |
| Sales Field | `sales` | Opname, penyaluran (create), lihat mitra |
| Warung/Toko | `mitra` | Input laku/retur, request restock |
| Pabrikan | `pemasok` | Read-only laporan & performa produknya |

- Middleware RBAC ada di `middleware/rbac.ts`
- Setiap API route server WAJIB cek role sebelum proses

## 7. Modul Aplikasi (urutan pengerjaan)

1. **[SETUP]** Instalasi & konfigurasi ← *Sedang dikerjakan*
2. **[DB]** Database migrations (16 tabel)
3. **[AUTH]** Login/JWT/RBAC
4. **[A]** Master Data (Supplier, Produk, Mitra, Gudang, User)
5. **[B]** Penerimaan Barang
6. **[C]** Penyaluran & Faktur
7. **[D]** Opname Stok
8. **[E]** Rekonsiliasi Keuangan
9. **[F]** Request Restock
10. **[G]** Analitik & Prediksi Stok (Moving Average)

## 8. Perintah Penting (npm scripts)

```bash
pnpm dev              # Jalankan dev server (default: http://localhost:3000)
pnpm build            # Build production
pnpm db:generate      # Generate migration dari schema Drizzle
pnpm db:migrate       # Jalankan migration ke database
pnpm db:studio        # Buka Drizzle Studio (GUI database)
pnpm typecheck        # TypeScript type check
```

## 9. Aturan Wajib untuk AI Agent

### ✅ HARUS dilakukan:
1. **Baca `progress.md` dulu** sebelum mulai task apapun
2. **Update `progress.md`** setiap kali task selesai (ganti ⏳ → ✅)
3. **Ikuti konvensi penamaan** tabel dalam Bahasa Indonesia
4. **Gunakan Drizzle ORM** untuk semua query database, BUKAN raw SQL
5. **Gunakan Zod** untuk validasi semua input API
6. **Cek `.env`** sebelum hardcode kredensial apapun

### ❌ DILARANG:
1. Mengganti tech stack tanpa konfirmasi eksplisit dari user
2. Hardcode kredensial database di luar `.env`
3. Menggunakan `any` di TypeScript (strict mode)
4. Menulis raw SQL langsung (gunakan Drizzle)
5. Menghapus file `AGENTS.md`, `PRD_SIKONS_v1.2.md`, atau `progress.md`
6. Menjalankan `DROP TABLE` atau operasi destruktif tanpa konfirmasi

## 10. Catatan Instalasi & Environment

### Masalah pnpm workspace (SUDAH DIKETAHUI):
- Sistem ini ada di `/home/adhinath/JOKI/Sistem-Informasi-Titip-Jual/`
- Ada parent monorepo di `/home/adhinath/Project/monorepo-erp-pij/` yang punya `pnpm-workspace.yaml`
- File `.npmrc` lokal dengan `shamefully-hoist=true` wajib ada untuk isolasi
- Gunakan perintah: `pnpm install --config.dedupe-peer-dependents=false`

### Cek Docker MariaDB:
```bash
docker ps | grep mariadb_local
docker exec mariadb_local mariadb -u root -prootpassword -e "USE SITJ_DB; SHOW TABLES;"
```

---

*AGENTS.md ini harus dibaca oleh setiap AI agent di awal setiap sesi kerja.*
*Update bagian "Catatan Instalasi" jika ditemukan issue baru.*
