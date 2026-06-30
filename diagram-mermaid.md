# Kumpulan Diagram Mermaid — SIKONS

> File ini berisi kode Mermaid untuk semua diagram yang digunakan di Bab 3.
> Copy-paste kode di antara blok ` ```mermaid ` ke tools seperti:
> - **Online:** https://mermaid.live
> - **VS Code extension:** Markdown Preview Mermaid Support
> - **GitHub:** paste langsung di file `.md` — akan dirender otomatis

---

## 1. ERD — Entity Relationship Diagram

```mermaid
erDiagram
    pemasok ||--o{ produk : mempunyai
    pemasok ||--o{ penerimaan_barang : memasok
    gudang ||--o{ stok_gudang : menyimpan
    gudang ||--o{ penerimaan_barang : menerima
    gudang ||--o{ penyaluran : asal
    produk ||--o{ stok_gudang : dicatat
    produk ||--o{ item_penerimaan_barang : diterima
    produk ||--o{ item_penyaluran : disalurkan
    produk ||--o{ item_opname : diopname
    produk ||--o{ item_permintaan_stok : diminta
    mitra ||--o{ penyaluran : menerima
    mitra ||--o{ opname_stok : diopname
    mitra ||--o{ permintaan_stok : meminta
    pengguna ||--o{ penerimaan_barang : menerima
    pengguna ||--o{ penyaluran : sales
    pengguna ||--o{ penyaluran : dibuat_oleh
    pengguna ||--o{ opname_stok : sales
    pengguna ||--o{ opname_stok : dibuat_oleh
    pengguna ||--o{ permintaan_stok : meminta
    pengguna ||--o{ permintaan_stok : menyetujui
    penerimaan_barang ||--o{ item_penerimaan_barang : terdiri
    penyaluran ||--o{ item_penyaluran : terdiri
    penyaluran ||--|| faktur : menerbitkan
    penyaluran ||--o{ permintaan_stok : referensi
    opname_stok ||--o{ item_opname : terdiri
    permintaan_stok ||--o{ item_permintaan_stok : terdiri

    pemasok {
        bigint id PK
        varchar nama
        varchar kategoriMerek
        varchar narahubung
        tinyint apakahAktif
    }

    produk {
        bigint id PK
        varchar sku UK
        varchar nama
        bigint idPemasok FK
        varchar satuan
        decimal hargaPabrik
        decimal hargaGrosir
        decimal hargaRetail
        text gambar
        tinyint apakahAktif
    }

    gudang {
        bigint id PK
        varchar kode UK
        varchar nama
        text alamat
        tinyint apakahAktif
    }

    stok_gudang {
        bigint id PK
        bigint idGudang FK
        bigint idProduk FK
        int jumlah
        timestamp diperbaruiPada
    }

    mitra {
        bigint id PK
        varchar nama
        varchar namaPemilik
        varchar telepon
        varchar alamat
        decimal lat
        decimal lng
        bigint idSalesDitugaskan FK
        tinyint apakahAktif
    }

    pengguna {
        bigint id PK
        varchar nama
        varchar email UK
        varchar passwordHash
        enum peran
        bigint idMitra FK
        bigint idPemasok FK
        tinyint apakahAktif
    }

    penerimaan_barang {
        bigint id PK
        varchar nomorPenerimaan UK
        bigint idPemasok FK
        bigint idGudang FK
        bigint diterimaOleh FK
        date tanggalPenerimaan
        enum status
    }

    item_penerimaan_barang {
        bigint id PK
        bigint idPenerimaan FK
        bigint idProduk FK
        int jumlah
        decimal hargaPabrikAktual
    }

    penyaluran {
        bigint id PK
        varchar nomorPenyaluran UK
        bigint idGudangAsal FK
        bigint idMitra FK
        bigint idSales FK
        date tanggalPenyaluran
        enum status
        bigint dibuatOleh FK
    }

    item_penyaluran {
        bigint id PK
        bigint idPenyaluran FK
        bigint idProduk FK
        int jumlahDikirim
        decimal snapshotHargaRetail
        decimal snapshotHargaGrosir
    }

    faktur {
        bigint id PK
        varchar nomorFaktur UK
        bigint idPenyaluran FK
        decimal totalNilai
        timestamp diterbitkanPada
        varchar urlPdf
    }

    opname_stok {
        bigint id PK
        varchar nomorOpname UK
        bigint idMitra FK
        bigint idSales FK
        date tanggalKunjungan
        enum status
        tinyint memilikiAnomali
        bigint dibuatOleh FK
    }

    item_opname {
        bigint id PK
        bigint idOpname FK
        bigint idProduk FK
        int stokAwal
        int jumlahLaku
        int jumlahRetur
        int hilang
        enum penanggungHilang
        int stokFisik
        enum kondisiRetur
        tinyint apakahAnomali
    }

    permintaan_stok {
        bigint id PK
        varchar nomorPermintaan UK
        bigint idMitra FK
        bigint dimintaOleh FK
        enum status
        bigint disetujuiOleh FK
        bigint idPenyaluran FK
    }

    item_permintaan_stok {
        bigint id PK
        bigint idPermintaan FK
        bigint idProduk FK
        int jumlahDiminta
        int jumlahDisetujui
    }
```

---

## 2. Class Diagram

```mermaid
classDiagram
    class Pemasok {
        +BigInt id
        +String nama
        +String kategoriMerek
        +String narahubung
        +TinyInt apakahAktif
    }

    class Produk {
        +BigInt id
        +String sku
        +String nama
        +BigInt idPemasok
        +String satuan
        +Decimal hargaPabrik
        +Decimal hargaGrosir
        +Decimal hargaRetail
        +String gambar
        +TinyInt apakahAktif
    }

    class Gudang {
        +BigInt id
        +String kode
        +String nama
        +String alamat
        +TinyInt apakahAktif
    }

    class StokGudang {
        +BigInt id
        +BigInt idGudang
        +BigInt idProduk
        +Int jumlah
        +Timestamp diperbaruiPada
    }

    class Mitra {
        +BigInt id
        +String nama
        +String namaPemilik
        +String telepon
        +String alamat
        +Decimal lat
        +Decimal lng
        +BigInt idSalesDitugaskan
        +TinyInt apakahAktif
    }

    class Pengguna {
        +BigInt id
        +String nama
        +String email
        +String passwordHash
        +String peran
        +BigInt idMitra
        +BigInt idPemasok
        +TinyInt apakahAktif
    }

    class PenerimaanBarang {
        +BigInt id
        +String nomorPenerimaan
        +BigInt idPemasok
        +BigInt idGudang
        +BigInt diterimaOleh
        +Date tanggalPenerimaan
        +String status
    }

    class ItemPenerimaanBarang {
        +BigInt id
        +BigInt idPenerimaan
        +BigInt idProduk
        +Int jumlah
        +Decimal hargaPabrikAktual
    }

    class Penyaluran {
        +BigInt id
        +String nomorPenyaluran
        +BigInt idGudangAsal
        +BigInt idMitra
        +BigInt idSales
        +Date tanggalPenyaluran
        +String status
        +BigInt dibuatOleh
    }

    class ItemPenyaluran {
        +BigInt id
        +BigInt idPenyaluran
        +BigInt idProduk
        +Int jumlahDikirim
        +Decimal snapshotHargaRetail
        +Decimal snapshotHargaGrosir
    }

    class Faktur {
        +BigInt id
        +String nomorFaktur
        +BigInt idPenyaluran
        +Decimal totalNilai
        +Timestamp diterbitkanPada
        +String urlPdf
    }

    class OpnameStok {
        +BigInt id
        +String nomorOpname
        +BigInt idMitra
        +BigInt idSales
        +Date tanggalKunjungan
        +String status
        +TinyInt memilikiAnomali
        +BigInt dibuatOleh
    }

    class ItemOpname {
        +BigInt id
        +BigInt idOpname
        +BigInt idProduk
        +Int stokAwal
        +Int jumlahLaku
        +Int jumlahRetur
        +Int hilang
        +String penanggungHilang
        +Int stokFisik
        +String kondisiRetur
        +TinyInt apakahAnomali
    }

    class PermintaanStok {
        +BigInt id
        +String nomorPermintaan
        +BigInt idMitra
        +BigInt dimintaOleh
        +String status
        +BigInt disetujuiOleh
        +BigInt idPenyaluran
    }

    class ItemPermintaanStok {
        +BigInt id
        +BigInt idPermintaan
        +BigInt idProduk
        +Int jumlahDiminta
        +Int jumlahDisetujui
    }

    Pemasok "1" --> "*" Produk : mempunyai
    Pemasok "1" --> "*" PenerimaanBarang : memasok
    Gudang "1" --> "*" StokGudang : menyimpan
    Gudang "1" --> "*" PenerimaanBarang : menerima
    Gudang "1" --> "*" Penyaluran : asal
    Produk "1" --> "*" StokGudang : dicatat_di
    Produk "1" --> "*" ItemPenerimaanBarang : diterima
    Produk "1" --> "*" ItemPenyaluran : disalurkan
    Produk "1" --> "*" ItemOpname : diopname
    Produk "1" --> "*" ItemPermintaanStok : diminta
    Mitra "1" --> "*" Penyaluran : menerima
    Mitra "1" --> "*" OpnameStok : diopname
    Mitra "1" --> "*" PermintaanStok : meminta
    Pengguna "1" --> "*" PenerimaanBarang : menerima
    Pengguna "1" --> "*" Penyaluran : sales
    Pengguna "1" --> "*" OpnameStok : sales
    Pengguna "1" --> "*" PermintaanStok : diminta
    Pengguna "1" --> "*" PermintaanStok : menyetujui
    PenerimaanBarang "1" --> "*" ItemPenerimaanBarang : terdiri
    Penyaluran "1" --> "*" ItemPenyaluran : terdiri
    Penyaluran "1" --> "1" Faktur : menerbitkan
    OpnameStok "1" --> "*" ItemOpname : terdiri
    PermintaanStok "1" --> "*" ItemPermintaanStok : terdiri
```

---

## 3. Use Case Diagram

```mermaid
flowchart LR
    Penyalur((Penyalur))
    Sales((Sales Field))
    Mitra((Mitra))
    Pemasok((Pemasok))
    
    subgraph SIKONS[Sistem Informasi Konsinyasi - SIKONS]
        UC1[Login & Autentikasi]
        UC2[Kelola Master Data\nPemasok, Produk, Gudang, Mitra, User]
        UC3[Penerimaan Barang\nCatat & Konfirmasi Penerimaan]
        UC4[Penyaluran & Faktur\nDistribusi & Generate Faktur]
        UC5[Opname Stok\nCatat Laku, Retur, Deteksi Anomali]
        UC6[Rekonsiliasi Keuangan\nThree-tier Pricing]
        UC7[Request Restok\nPermintaan & Approve Stok]
        UC8[Lihat Laporan\nPerforma Produk & Penjualan]
    end
    
    Penyalur --- UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8
    Sales --- UC1 & UC3 & UC4 & UC5
    Mitra --- UC1 & UC5 & UC7
    Pemasok --- UC1 & UC8
```

---

## 4. Activity Diagram — Penerimaan Barang

```mermaid
flowchart TD
    Start([Mulai]) --> A[Membuka Form Penerimaan]
    A --> B[Memilih Pemasok]
    B --> C[Memilih Gudang Tujuan]
    C --> D[Mengisi Tanggal Penerimaan]
    D --> E[Menambahkan Item Barang\nPilih Produk, Jumlah, Harga Pabrik Aktual]
    E --> F{Simpan?}
    F -->|Draft| G[Menyimpan Draft]
    F -->|Konfirmasi| H[Validasi Data]
    H --> I{Data Lengkap?}
    I -->|Tidak| J[Menampilkan Error]
    J --> E
    I -->|Ya| K[Mengubah Status menjadi Completed]
    K --> L[Menambah Stok Gudang]
    L --> M[Menampilkan Notifikasi Sukses]
    G --> End([Selesai])
    M --> End
```

---

## 5. Activity Diagram — Penyaluran & Faktur

```mermaid
flowchart TD
    Start([Mulai]) --> A[Membuka Form Penyaluran]
    A --> B[Memilih Gudang Asal]
    B --> C[Memilih Mitra Tujuan]
    C --> D[Memilih Sales Pengantar]
    D --> E[Menambahkan Item Barang\nPilih Produk, Jumlah Kirim]
    E --> F{Simpan?}
    F -->|Draft| G[Menyimpan Draft]
    F -->|Kirim| H[Validasi Ketersediaan Stok]
    H --> I{Stok Cukup?}
    I -->|Tidak| J[Menampilkan Peringatan]
    J --> E
    I -->|Ya| K[Mengubah Status menjadi Sent]
    K --> L[Mengurangi Stok Gudang]
    L --> M[Generate Faktur & Nomor Faktur]
    M --> N[Menampilkan Notifikasi Sukses]
    G --> End([Selesai])
    N --> End
```

---

## 6. Activity Diagram — Opname Stok

```mermaid
flowchart TD
    Start([Mulai]) --> A[Membuka Form Opname]
    A --> B[Memilih Mitra]
    B --> C[Memilih Tanggal Kunjungan]
    C --> D[Input Item Opname per Produk]
    D --> E[Mengisi Jumlah Laku & Retur]
    E --> F[Sistem Otomatis Menghitung Stok Fisik]
    F --> G{Stok Fisik Negatif?}
    G -->|Ya| H[Menandai Anomali]
    G -->|Tidak| I[Lanjut]
    H --> I
    I --> J{Simpan?}
    J -->|Draft| K[Menyimpan Draft]
    J -->|Submit| L[Menyimpan & Mengubah Status Submitted]
    L --> M[Menampilkan Notifikasi]
    K --> End([Selesai])
    M --> End
```

---

## 7. Sequence Diagram — Konfirmasi Penerimaan Barang

```mermaid
sequenceDiagram
    actor Penyalur
    participant UI as Frontend
    participant API as Server API
    participant DB as MariaDB
    
    Penyalur->>UI: Mengisi form penerimaan barang
    Penyalur->>UI: Menekan tombol "Konfirmasi"
    UI->>API: PATCH /api/penerimaan-barang/:id
    
    Note over API: Validasi status draft
    Note over API: Validasi RBAC (penyalur only)
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: UPDATE penerimaan_barang SET status = 'completed'
    API->>DB: SELECT item_penerimaan_barang WHERE id_penerimaan = ?
    API->>DB: INSERT INTO stok_gudang (id_gudang, id_produk, jumlah) ON DUPLICATE KEY UPDATE jumlah = jumlah + VALUES(jumlah)
    DB-->>API: OK
    API->>DB: COMMIT
    
    API-->>UI: Response 200 { message: "Berhasil dikonfirmasi" }
    UI-->>Penyalur: Menampilkan notifikasi sukses
    UI-->>Penyalur: Stok gudang bertambah
```

---

## 8. Arsitektur Sistem

```mermaid
flowchart TD
    subgraph Client
        B[Browser - Desktop & Mobile]
    end
    
    subgraph Nuxt3[Nuxt 3 - SIKONS]
        direction TB
        
        subgraph Frontend_ [Frontend]
            P[Pages - File-based Routing]
            C[Components - Nuxt UI]
            L[Layouts - App Layout]
            CP[Composables]
        end
        
        subgraph Backend_ [Backend - Nitro Engine]
            API[Server API Routes\nRESTful Endpoints]
            MW[Middleware\nAuth & RBAC Validation]
            U[Utilities\nJWT Helpers]
        end
    end
    
    subgraph Validation_
        Z[Zod - Schema Validation]
    end
    
    subgraph ORM_
        D[Drizzle ORM\nQuery Builder & Migrations]
    end
    
    subgraph DB_
        M[(MariaDB 10.10\nContainer Docker)]
    end
    
    B <-->|HTTP/HTTPS| Nuxt3
    Frontend_ <--> Backend_
    API --> MW
    MW --> Z
    Z --> D
    D --> M
```
