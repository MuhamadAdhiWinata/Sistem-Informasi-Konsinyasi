# Sistem Informasi Titip Jual (SITJ)

Aplikasi manajemen konsinyasi terintegrasi untuk UMKM.

## Tech Stack

- **Framework:** Nuxt 3 (TypeScript)
- **UI:** Nuxt UI + Tailwind CSS
- **Database:** MariaDB (Docker)
- **ORM:** Drizzle ORM
- **Auth:** JWT

## Prasyarat

- Node.js >= 18
- pnpm >= 10
- Docker (untuk MariaDB)

## Setup

```bash
# Install dependencies
pnpm install

# Jalankan database
docker compose up -d

# Setup database
pnpm db:reset
```

## Command Database

| Perintah | Deskripsi |
|:---------|:-----------|
| `pnpm db:generate` | Generate migration file dari perubahan schema Drizzle |
| `pnpm db:migrate`  | Jalankan semua migration yang belum diaplikasikan ke database |
| `pnpm db:seed`     | Isi database dengan data dummy (seeder) |
| `pnpm db:reset`    | **Kosongkan semua tabel → migrate → seed** (reset total data) |
| `pnpm db:studio`   | Buka Drizzle Studio (GUI database) |

> **⚠️ Catatan:** `pnpm db:reset` menjalankan 3 langkah sekaligus:
> 1. Hapus semua data dari seluruh tabel (tanpa drop database)
> 2. Jalankan migration (update struktur tabel)
> 3. Isi data dummy (seeder)

## Development

```bash
pnpm dev
```

Akses: http://localhost:3000