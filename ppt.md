# Prompt untuk Gamma.app — PPT SIKONS (Sistem Informasi Konsinyasi)

> Copy-paste teks di bawah ini ke gamma.app untuk generate PPT secara otomatis.

---

## Judul Presentasi
**SIKONS — Sistem Informasi Konsinyasi**  
Digitalisasi Manajemen Titip Jual untuk UMKM  
*Skripsi — Sistem Informasi*

---

## Slide 1: Cover
- **Judul:** SIKONS — Sistem Informasi Konsinyasi
- **Subjudul:** Digitalisasi Manajemen Titip Jual untuk UMKM
- **Nama:** [Nama Mahasiswa]
- **Instansi:** [Universitas]
- **Tahun:** 2026

---

## Slide 2: Latar Belakang
- Pencatatan konsinyasi masih manual (buku/Excel) → rawan error, sulit dilacak
- UMKM tidak punya visibilitas stok real-time antar gudang dan mitra
- Rekonsiliasi keuangan antara Penyalur, Mitra, dan Pemasok rumit & memakan waktu
- **Solusi:** Aplikasi web terintegrasi untuk seluruh alur konsinyasi

---

## Slide 3: Rumusan Masalah
1. Bagaimana merancang sistem yang mencatat penerimaan barang dari Pemasok hingga distribusi ke Mitra?
2. Bagaimana mengotomatiskan opname stok dan rekonsiliasi keuangan multi-pihak?
3. Bagaimana menyediakan visibilitas stok real-time bagi semua peran pengguna?

---

## Slide 4: Tech Stack
| Layer | Teknologi |
|:------|:-----------|
| **Framework** | Nuxt 3 (Vue 3) |
| **Language** | TypeScript (strict) |
| **UI** | Nuxt UI + Tailwind CSS |
| **Database** | MariaDB 10.10 (Docker) |
| **ORM** | Drizzle ORM |
| **Auth** | JWT + RBAC |
| **Validasi** | Zod |

---

## Slide 5: Arsitektur Sistem
- **Frontend:** Nuxt 3 — file-based routing, auto-import, SSR/SPA hybrid
- **Backend:** Nuxt Server Routes (REST API) — grouped per modul
- **Database:** MariaDB dengan 16 tabel relasional (ACID compliant)
- **Auth:** JWT access token + middleware RBAC di setiap API route
- **Layout:** Sidebar fixed + Topbar + Dark/Light mode

---

## Slide 6: 4 Peran Pengguna & RBAC
| Peran | Akses |
|:------|:-------|
| **Penyalur (Admin)** | Full access — semua modul CRUD |
| **Sales Field** | Input opname & penyaluran, lihat mitra & stok |
| **Mitra (Warung)** | Input laku/retur, lihat rekonsiliasi sendiri |
| **Pemasok (Pabrikan)** | Read-only laporan & performa produknya |

Setiap API route dicek perannya sebelum diproses.

---

## Slide 7: Modul A — Master Data
**5 fitur CRUD:**
1. **Pemasok** — data pabrikan, kategori merek, narahubung
2. **Produk/SKU** — kode unik, nama, satuan, 3-tier pricing (pabrik/grosir/retail)
3. **Mitra** — nama toko, pemilik, telepon, koordinat GPS, assign sales
4. **Gudang** — kode, nama, alamat
5. **Pengguna & Roles** — 4 peran dengan hak akses berbeda
6. **Monitoring Stok Gudang** — stok real-time per gudang per produk

---

## Slide 8: Modul B — Penerimaan Barang
- Form input: pilih Pemasok, Gudang tujuan, tanggal penerimaan
- Detail item: pilih Produk, jumlah, harga pabrik aktual
- **Workflow:** Draft → Completed
- Stok gudang **hanya bertambah** saat status = completed (bukan saat create)
- Cetak Surat Jalan Penerimaan (A4)

---

## Slide 9: Modul C — Penyaluran & Faktur
- Form: pilih Gudang asal, Mitra tujuan, Sales pengantar
- **Visibility stok:** tampil sisa stok gudang saat input item
- **Workflow:** Draft → Sent → Received
- Stok gudang **hanya berkurang** saat status = sent
- **Auto-generate Faktur Titip Jual** (INV-YYYY-NNNN) + kalkulasi total nilai
- Cetak/download PDF faktur via html2pdf.js

---

## Slide 10: Modul D — Opname Stok
- Header: pilih Mitra, Sales, tanggal kunjungan
- Detail per produk: Stok Awal, Jumlah Laku, Jumlah Retur, Stok Fisik
- **Rumus:** Stok Fisik = Stok Awal − Laku − Retur
- **Anomali:** Auto-flag jika stok fisik < 0 atau tidak konsisten
- **Workflow:** Draft → Submitted → Verified (penyalur)

---

## Slide 11: Modul E — Rekonsiliasi Keuangan
**Split dua view berdasarkan peran:**

**Rekonsiliasi Penyalur** (Penyalur only):
- Full three-tier pricing: Harga Pabrik → Harga Grosir → Harga Retail
- Laba Mitra = laku × (retail − grosir)
- Laba Penyalur = laku × (grosir − pabrik)
- Laba rugi barang hilang (ditanggung mitra/penyalur)

**Rekonsiliasi Mitra** (Mitra only):
- Simplified: hanya Harga Grosir & Harga Retail
- Hanya laba mitra — tanpa data harga pabrik/laba penyalur

Export CSV + Cetak.

---

## Slide 12: Entity Relationship Diagram (ERD)
**16 tabel dalam Bahasa Indonesia:**
- pengguna, pemasok, produk, gudang, stok_gudang, mitra
- penerimaan_barang, item_penerimaan_barang
- penyaluran, item_penyaluran, faktur
- opname_stok, item_opname
- permintaan_stok, item_permintaan_stok
- prediksi_stok (dihapus dari MVP)

*Relasi: pengguna → mitra/pemasok, penyaluran → gudang+mitra, faktur → penyaluran, opname → mitra*

---

## Slide 13: Alur Bisnis Utama
```
Pemasok → [Penerimaan Barang] → Gudang → [Penyaluran] → Mitra
                                                          ↓
                                        [Opname Stok] → Laku & Retur
                                                          ↓
                                              [Rekonsiliasi Keuangan]
                                              Laba Mitra & Laba Penyalur
```

---

## Slide 14: Progress Pembangunan
| Kategori | Progress |
|:---------|:--------:|
| Inisialisasi & Setup | 83% |
| Database (16 tabel) | 94% |
| Modul A — Master Data | **100%** |
| Modul B — Penerimaan | **100%** |
| Modul C — Penyaluran & Faktur | **100%** |
| Modul D — Opname Stok | **100%** |
| Modul E — Rekonsiliasi | **100%** |
| Autentikasi & RBAC | **100%** |
| UI/UX Global | 88% |
| **TOTAL** | **76% (82/108 task)** |

---

## Slide 15: Demo Aplikasi
**Tampilkan screenshot/live demo:**
1. **Login** — halaman auth glassmorphism
2. **Dashboard** — ringkasan data
3. **Flow lengkap:** Penerimaan Barang → Penyaluran → Faktur → Opname Stok → Rekonsiliasi
4. **Sidebar navigasi** — dinamis berdasarkan role
5. **Dark mode** toggle

---

## Slide 16: Kesimpulan
1. SIKONS berhasil mendigitalisasi seluruh alur konsinyasi dari penerimaan hingga rekonsiliasi
2. Sistem mendukung 4 peran pengguna dengan hak akses berbeda (RBAC)
3. Visibilitas stok real-time dan otomatisasi faktur mengurangi kesalahan manual
4. Teknologi modern (Nuxt 3 + MariaDB) memastikan skalabilitas untuk UMKM
5. 76% progress — 5 modul utama sudah 100% selesai

---

## Slide 17: Saran
- Implementasi notifikasi real-time untuk approval request
- Modul prediksi stok berbasis AI/Moving Average
- Aplikasi mobile native (offline-first untuk sales lapangan)
- Deployment produksi dengan CI/CD

---

## Slide 18: Terima Kasih
- **Q&A**
- **Demo langsung** aplikasi SIKONS
