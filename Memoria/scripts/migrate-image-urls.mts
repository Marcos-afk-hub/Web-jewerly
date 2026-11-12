/**
 * Migración de datos: URLs de Pexels → fotografía local.
 *
 * Cuando el catálogo se sembró por primera vez, las imágenes se guardaron
 * como URLs del CDN de Pexels. Ahora la fotografía se sirve desde
 * `public/images/producto/`, pero la base de datos todavía conserva las URLs
 * antiguas.
 *
 * Este script reescribe los campos `images` de productos y categorías para
 * apuntar a los archivos locales. Es idempotente: si no encuentra URLs de
 * Pexels, no hace nada.
 *
 *   npm run db:migrate:images
 */
import { db } from "@/db";
import { pool } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

/** Convierte una URL de Pexels a la ruta local equivalente. */
function toLocalPath(url: string) {
  const match = url.match(/images\.pexels\.com\/photos\/(\d+)\//);
  if (!match) return url;
  return `/images/producto/${match[1]}.jpg`;
}

async function main() {
  const rows = await db.select({ id: products.id, slug: products.slug, images: products.images }).from(products);
  let updated = 0;

  for (const row of rows) {
    const next = row.images.map(toLocalPath);
    const changed = next.some((value, index) => value !== row.images[index]);
    if (!changed) continue;
    await db.update(products).set({ images: next }).where(eq(products.id, row.id));
    updated += 1;
    console.log(`  ✓ ${row.slug}`);
  }

  console.log(
    updated === 0
      ? "→ No había URLs de Pexels pendientes. Nada que hacer."
      : `→ ${updated} producto(s) actualizados a fotografía local.`,
  );
}

main()
  .catch((error) => {
    console.error("✗ Error en la migración:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
