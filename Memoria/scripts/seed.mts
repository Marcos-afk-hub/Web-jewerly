/**
 * Siembra el catálogo de productos y sus reseñas.
 *
 * El sitio también siembra solo al vuelo (`ensureCatalogSeeded`), pero este
 * script permite hacerlo de forma explícita y ver el resultado en la base de
 * datos:
 *
 *   npm run db:seed
 */
import { db } from "@/db";
import { ensureCatalogSeeded } from "@/lib/catalog";
import { pool } from "@/db";

async function main() {
  console.log("→ Sembrando catálogo…");
  await ensureCatalogSeeded();
  console.log("✓ Catálogo sembrado.");
}

main()
  .catch((error) => {
    console.error("✗ Error al sembrar:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
