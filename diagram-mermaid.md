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

> **UML Use Case Diagram** — `[Aktor]` persegi di luar batas sistem, `(Use Case)` oval di dalam `subgraph` (system boundary).
> Garis putus `-. <<include>> .->` untuk relasi <<include>> dan <<extend>> (standar UML).

```mermaid
flowchart LR
    subgraph SISTEM["Sistem Informasi Titip Jual (SIKONS)"]
        direction TB
        UC01(Login)
        UC02(Mengelola Pemasok)
        UC03(Mengelola Produk)
        UC04(Mengelola Gudang)
        UC05(Mengelola Mitra)
        UC06(Mengelola Pengguna)
        UC07(Melihat Stok Gudang)
        UC08(Mengelola Penerimaan Barang)
        UC09(Mengelola Penyaluran)
        UC10(Membuat Faktur)
        UC11(Melakukan Opname Stok)
        UC12(Mendeteksi Anomali Stok)
        UC13(Melihat Rekonsiliasi Penyalur)
        UC14(Melihat Rekonsiliasi Mitra)
        UC15(Mengajukan Permintaan Stok)
        UC16(Menyetujui Permintaan Stok)
        UC17(Melihat Laporan & Analitik)
    end

    PEN[Penyalur] --- UC01 & UC02 & UC03 & UC04 & UC05 & UC06
    PEN --- UC08 & UC09 & UC13
    PEN --- UC16 & UC17

    SAL[Sales Field] --- UC01 & UC07 & UC08 & UC09
    SAL --- UC11 & UC15

    MIT[Mitra] --- UC01 & UC11 & UC14 & UC15

    PEM[Pemasok] --- UC01 & UC17

    UC09 -. <<include>> .-> UC10
    UC16 -. <<include>> .-> UC09
    UC12 -. <<extend>> .-> UC11
```

---

## 4. Activity Diagram — Penerimaan Barang

> **UML Activity Diagram** — Initial node `((Mulai))`, action node `(Aksi)`, decision `{Pertanyaan}`,
> final node `((Selesai))`. Aliran digambarkan dengan panah `-->`.

```mermaid
flowchart TD
    Start((Mulai))
    Start --> A1(Membuka Form Penerimaan)
    A1 --> A2(Memilih Pemasok)
    A2 --> A3(Memilih Gudang Tujuan)
    A3 --> A4(Mengisi Tanggal Penerimaan)
    A4 --> A5(Menambahkan Item Barang)
    A5 --> D1{Simpan?}
    D1 -->|Draft| E1[(Simpan Draft)]
    D1 -->|Konfirmasi| D2{Data Lengkap?}
    D2 -->|Tidak| Err1[Tampilkan Error]
    Err1 --> A5
    D2 -->|Ya| A6(Konfirmasi Penerimaan)
    A6 --> A7(Update Stok Gudang)
    A7 --> Notif1[Tampilkan Notifikasi Sukses]
    E1 --> End((Selesai))
    Notif1 --> End
```

---

## 5. Activity Diagram — Penyaluran & Faktur

```mermaid
flowchart TD
    Start((Mulai))
    Start --> A1(Membuka Form Penyaluran)
    A1 --> A2(Memilih Gudang Asal)
    A2 --> A3(Memilih Mitra Tujuan)
    A3 --> A4(Memilih Sales Pengantar)
    A4 --> A5(Menambahkan Item Barang)
    A5 --> D1{Simpan?}
    D1 -->|Draft| E1[(Simpan Draft)]
    D1 -->|Kirim| D2{Cukup Stok?}
    D2 -->|Tidak| Err1[Tampilkan Peringatan]
    Err1 --> A5
    D2 -->|Ya| A6(Kirim Penyaluran)
    A6 --> A7(Kurangi Stok Gudang)
    A7 --> A8(Generate Faktur)
    A8 --> Notif1[Tampilkan Notifikasi Sukses]
    E1 --> End((Selesai))
    Notif1 --> End
```

---

## 6. Activity Diagram — Opname Stok

```mermaid
flowchart TD
    Start((Mulai))
    Start --> A1(Membuka Form Opname)
    A1 --> A2(Memilih Mitra)
    A2 --> A3(Memilih Tanggal Kunjungan)
    A3 --> A4(Input Item Opname per Produk)
    A4 --> A5(Mengisi Jumlah Laku & Retur)
    A5 --> Sys1(Hitung Stok Fisik)
    Sys1 --> D1{Stok Fisik < 0?}
    D1 -->|Ya| A6(Tandai Anomali)
    D1 -->|Tidak| D2{Simpan?}
    A6 --> D2
    D2 -->|Draft| E1[(Simpan Draft)]
    D2 -->|Submit| A7(Simpan & Ubah Status)
    A7 --> Notif1[Tampilkan Notifikasi]
    E1 --> End((Selesai))
    Notif1 --> End
```

---

## 7. Sequence Diagram — Konfirmasi Penerimaan Barang

> **UML Sequence Diagram** — `activate`/`deactivate` untuk activation bar pada lifeline.
> `->>+` synchronous call (mengaktifkan target), `-->>-` return response (menonaktifkan target).

```mermaid
sequenceDiagram
    actor Penyalur
    participant UI as Frontend
    participant API as Server API
    participant DB as MariaDB
    
    Penyalur->>UI: Klik tombol "Konfirmasi"
    activate UI
    
    UI->>+API: PATCH /api/penerimaan-barang/:id
    Note over API: Validasi status draft & RBAC
    
    API->>+DB: UPDATE penerimaan_barang<br/>SET status = 'completed'
    DB-->>-API: OK
    
    API->>+DB: SELECT item_penerimaan_barang<br/>WHERE id_penerimaan = :id
    DB-->>-API: data items
    
    API->>+DB: UPDATE stok_gudang SET jumlah = jumlah + :qty
    DB-->>-API: OK
    
    API-->>-UI: 200 OK { message: "Berhasil dikonfirmasi" }
    
    UI-->>Penyalur: Tampilkan notifikasi sukses
    deactivate UI
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
