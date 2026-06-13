ALTER TABLE item_opname ADD COLUMN penanggung_hilang ENUM('penyalur','mitra') NOT NULL DEFAULT 'penyalur' AFTER hilang;
