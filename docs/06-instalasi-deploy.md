# 06 — Instalasi & Deployment

## Prasyarat

| Tools | Versi | Keperluan |
|:------|:------|:----------|
| Node.js | ≥ 18 (disarankan 22) | Menjalankan Nuxt |
| pnpm | ≥ 10 | Package manager |
| Docker + Docker Compose | terbaru | Database MariaDB & deployment |
| MySQL/MariaDB | 10.10 | Alternatif tanpa Docker |

## Konfigurasi Environment

Aplikasi membaca konfigurasi dari variabel environment (dipetakan ke `runtimeConfig` di `nuxt.config.ts`):

| Variabel | Default | Deskripsi |
|:---------|:--------|:----------|
| `DB_HOST` | `localhost` | Host database |
| `DB_PORT` | `3306` | Port database |
| `DB_USER` | `root` | User database |
| `DB_PASSWORD` | `rootpassword` | Password database |
| `DB_NAME` | `SITJ_DB` | Nama database |
| `JWT_SECRET` | `sikons-dev-secret-change-in-prod` | Secret untuk menandatangani JWT (WAJIB diganti di produksi) |

Contoh file `.env` (digunakan oleh `docker-compose.yml`):

```bash
# Database
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=ganti-dengan-password-kuat
DB_NAME=SITJ_DB

# JWT
JWT_SECRET=ganti-dengan-secret-acak-yang-panjang

# Aplikasi
APP_PORT=3000
```

## Menjalankan di Lokal (Development)

```bash
# 1. Install dependensi
pnpm install

# 2. Jalankan database (MariaDB via Docker)
docker compose up -d db

# 3. Siapkan skema & seed data dummy
pnpm db:reset

# 4. Jalankan dev server (hot reload)
pnpm dev
# → buka http://localhost:3000
```

## Perintah Database (Drizzle)

| Perintah | Fungsi |
|:---------|:-------|
| `pnpm db:generate` | Generate file migration SQL dari perubahan skema |
| `pnpm db:migrate` | Jalankan migration ke database |
| `pnpm db:seed` | Isi database dengan data dummy |
| `pnpm db:reset` | Hapus semua tabel → migrate → seed (reset penuh) |
| `pnpm db:studio` | Buka Drizzle Studio (GUI database) |

## Build Produksi (Lokal)

```bash
pnpm build      # build .output
pnpm preview    # pratinjau hasil build
```

## Deployment dengan Docker Compose

`docker-compose.yml` mendefinisikan 3 service:

| Service | Image / Build | Peran |
|:--------|:--------------|:------|
| `db` | `mariadb:10.10` | Database (volume persisten `mariadb_data`) |
| `init` | `build: .` | Menjalankan migration + seed sekali (`scripts/init-db.sh`) |
| `app` | `build: .` | Aplikasi Nuxt (port `3000`) |

**Alur startup:**
1. `db` menyala → tunggu sehat (healthcheck MariaDB).
2. `init` menjalankan `scripts/init-db.sh` (migrate + seed) → selesai.
3. `app` menyala setelah `init` sukses, ekspos port `3000`.

```bash
# Siapkan .env (lihat bagian Konfigurasi)
cp .env.example .env   # jika tersedia, atau buat manual

# Build & jalankan semua service
docker compose up -d --build

# Cek status
docker compose ps
docker compose logs -f app
```

Aplikasi dapat diakses di `http://<host>:3000`.

## Struktur Image (Dockerfile)

`Dockerfile` memakai **multi-stage build** berbasis `node:22-alpine`:

1. **Stage `builder`** — mengaktifkan pnpm 10, `pnpm install`, lalu `pnpm build` (menghasilkan `.output`).
2. **Stage `runner`** — menyalin `.output`, `node_modules`, `server/database`, dan `scripts/` untuk produksi, lalu menjalankan `node .output/server/index.mjs`.

## Catatan Produksi

- **Ganti `JWT_SECRET`** dengan nilai acak yang kuat di lingkungan produksi.
- **Ganti password database** (`DB_PASSWORD`).
- Database menggunakan **volume Docker** (`mariadb_data`) agar data persisten antar restart.
- Port database dipetakan ke host sebagai `3307` (agar tidak bentrok dengan MySQL lokal), dapat disesuaikan via `DB_PORT`.
- Backup database disarankan melalui dump MySQL/MariaDB (`mysqldump`).
