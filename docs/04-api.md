# 04 — Referensi API

API backend diekspos melalui Nitro server pada path `/api/*`. Frontend memanggil endpoint ini lewat `$fetch` (relatif), dan token JWT dikirim pada header `Authorization: Bearer <token>`.

## Konvensi

- **Base path**: `/api`
- **Autentikasi**: header `Authorization: Bearer <JWT>` (wajib untuk semua endpoint kecuali `POST /api/auth/login`).
- **Format body**: JSON.
- **Format respons sukses**: `{ "data": ..., "message": "..." }` (untuk sebagian besar endpoint).
- **Validasi body**: menggunakan **Zod**; body tidak valid akan mengembalikan error 4xx dengan pesan validasi.
- **Error**: menggunakan `createError` Nitro → respons `{ statusCode, statusMessage }` (mis. 401 Unauthorized, 403 Forbidden, 404 Not Found).
- **Struktur file**: setiap endpoint adalah satu file di `server/api/**` dengan pola `<path>.<method>.ts`.

## Autentikasi

| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| POST | `/api/auth/login` | Login; menerima `{ email, password }`, mengembalikan `{ data: { token, user }, message }` |
| POST | `/api/auth/change-password` | Ganti password (perlu `password_lama`, `password_baru`) |

## Data Master

### Pemasok
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/master/pemasok` | Daftar pemasok |
| POST | `/api/master/pemasok` | Tambah pemasok |
| GET | `/api/master/pemasok/:id` | Detail pemasok |
| PUT | `/api/master/pemasok/:id` | Ubah pemasok |
| DELETE | `/api/master/pemasok/:id` | Hapus pemasok |

### Produk
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/master/produk` | Daftar produk |
| POST | `/api/master/produk` | Tambah produk |
| GET | `/api/master/produk/:id` | Detail produk |
| PUT | `/api/master/produk/:id` | Ubah produk |
| DELETE | `/api/master/produk/:id` | Hapus produk |

### Mitra
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/master/mitra` | Daftar mitra |
| POST | `/api/master/mitra` | Tambah mitra |
| GET | `/api/master/mitra/:id` | Detail mitra |
| PUT | `/api/master/mitra/:id` | Ubah mitra |
| DELETE | `/api/master/mitra/:id` | Hapus mitra |

### Gudang
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/master/gudang` | Daftar gudang |
| POST | `/api/master/gudang` | Tambah gudang |
| GET | `/api/master/gudang/:id` | Detail gudang |
| PUT | `/api/master/gudang/:id` | Ubah gudang |
| DELETE | `/api/master/gudang/:id` | Hapus gudang |

### Pengguna
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/master/pengguna` | Daftar pengguna |
| POST | `/api/master/pengguna` | Tambah pengguna |
| GET | `/api/master/pengguna/:id` | Detail pengguna |
| PUT | `/api/master/pengguna/:id` | Ubah pengguna |
| DELETE | `/api/master/pengguna/:id` | Hapus pengguna |

### Stok Gudang
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/stok-gudang` | Saldo stok per produk per gudang |

## Transaksi

### Penerimaan Barang
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/penerimaan-barang` | Daftar penerimaan |
| POST | `/api/penerimaan-barang` | Buat penerimaan |
| GET | `/api/penerimaan-barang/:id` | Detail penerimaan (+ items) |
| PUT | `/api/penerimaan-barang/:id` | Ubah header/items |
| PATCH | `/api/penerimaan-barang/:id` | Ubah status (mis. → `completed`) |
| DELETE | `/api/penerimaan-barang/:id` | Hapus penerimaan |

### Penyaluran
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/penyaluran` | Daftar penyaluran |
| POST | `/api/penyaluran` | Buat penyaluran |
| GET | `/api/penyaluran/:id` | Detail penyaluran (+ items + faktur) |
| PUT | `/api/penyaluran/:id` | Ubah header/items |
| PATCH | `/api/penyaluran/:id` | Ubah status (mis. → `received`) |
| DELETE | `/api/penyaluran/:id` | Hapus penyaluran |

### Faktur
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/faktur` | Daftar faktur |

### Opname Stok
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/opname-stok` | Daftar opname |
| POST | `/api/opname-stok` | Buat opname |
| GET | `/api/opname-stok/expected-items` | Ambil stok titipan mitra (untuk prefill) |
| GET | `/api/opname-stok/:id` | Detail opname (+ items) |
| PATCH | `/api/opname-stok/:id` | Update / submit / verify opname |

### Permintaan Stok (Restok)
| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/permintaan-stok` | Daftar permintaan |
| POST | `/api/permintaan-stok` | Buat permintaan |
| GET | `/api/permintaan-stok/:id` | Detail permintaan |
| PATCH | `/api/permintaan-stok/:id` | Approve / reject / fulfill |

## Rekonsiliasi

| Method | Endpoint | Deskripsi |
|:-------|:---------|:----------|
| GET | `/api/rekonsiliasi-penyalur` | Ringkasan laba per mitra (untuk penyalur) |
| GET | `/api/rekonsiliasi-penyalur/:idMitra` | Detail rekonsiliasi satu mitra (penyalur) |
| GET | `/api/rekonsiliasi-mitra` | Ringkasan pendapatan mitra (untuk mitra) |
| GET | `/api/rekonsiliasi-mitra/:idMitra` | Detail rekonsiliasi mitra |

## Contoh Request & Response

**Login**

```
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@sikons.com", "password": "password123" }
```

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "nama": "Admin Pusat",
      "email": "admin@sikons.com",
      "peran": "penyalur",
      "idMitra": null,
      "idPemasok": null
    }
  },
  "message": "Login berhasil"
}
```

**Ambil daftar produk (dengan token)**

```
GET /api/master/produk
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```
