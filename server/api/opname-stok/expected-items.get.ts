import { sql } from 'drizzle-orm'
import { useDB } from '~~/server/utils/database'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const idMitra = Number(query.idMitra)
  if (!idMitra) throw createError({ statusCode: 400, statusMessage: 'Parameter idMitra wajib diisi' })

  const db = await useDB()

  const [rows] = await db.execute(
    sql`
      SELECT
        pr.id              as id_produk,
        pr.nama,
        pr.sku,
        COALESCE(SUM(ip.jumlah_dikirim), 0)           as total_distributed,
        MAX(p.tanggal_penyaluran)                     as last_penyaluran_tanggal,
        (
          SELECT p2.nomor_penyaluran
          FROM item_penyaluran ip2
          JOIN penyaluran p2 ON p2.id = ip2.id_penyaluran
          WHERE p2.id_mitra = ${idMitra}
            AND ip2.id_produk = pr.id
            AND p2.status IN ('sent', 'received')
          ORDER BY p2.tanggal_penyaluran DESC
          LIMIT 1
        )                                             as last_penyaluran_nomor,
        COALESCE((
          SELECT SUM(io2.jumlah_laku)
          FROM item_opname io2
          JOIN opname_stok os2 ON os2.id = io2.id_opname
          WHERE os2.id_mitra = ${idMitra}
            AND io2.id_produk = pr.id
        ), 0)                                         as total_sold,
        COALESCE((
          SELECT SUM(io2.jumlah_retur)
          FROM item_opname io2
          JOIN opname_stok os2 ON os2.id = io2.id_opname
          WHERE os2.id_mitra = ${idMitra}
            AND io2.id_produk = pr.id
        ), 0)                                         as total_returned,
        COALESCE((
          SELECT SUM(io2.hilang)
          FROM item_opname io2
          JOIN opname_stok os2 ON os2.id = io2.id_opname
          WHERE os2.id_mitra = ${idMitra}
            AND io2.id_produk = pr.id
        ), 0)                                         as total_hilang
      FROM produk pr
      INNER JOIN item_penyaluran ip ON ip.id_produk = pr.id
      INNER JOIN penyaluran p ON p.id = ip.id_penyaluran
      WHERE p.id_mitra = ${idMitra}
        AND p.status IN ('sent', 'received')
      GROUP BY pr.id, pr.nama, pr.sku
      ORDER BY pr.nama
    `
  )

  const items = (rows as unknown as any[]).map((row: any) => ({
    idProduk: row.id_produk,
    nama: row.nama,
    sku: row.sku,
    totalDistributed: Number(row.total_distributed),
    lastPenyaluranTanggal: row.last_penyaluran_tanggal,
    lastPenyaluranNomor: row.last_penyaluran_nomor,
    totalSold: Number(row.total_sold),
    totalReturned: Number(row.total_returned),
    totalHilang: Number(row.total_hilang),
    expectedStock: Math.max(0, Number(row.total_distributed) - Number(row.total_sold) - Number(row.total_returned) - Number(row.total_hilang)),
  }))

  return { data: items }
})
