import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // No se lanza aquí un error: durante el build de Vercel esta variable puede
  // no estar disponible (por ejemplo, en el despliegue de vista previa de un
  // PR, donde solo se aplican las variables del entorno de producción) y
  // abortar el build dejaría el sitio sin publicar.
  //
  // El sitio funciona sin base de datos: el catálogo y las reseñas tienen una
  // copia en memoria. Lo que sí falla, y con un mensaje claro, es cualquier
  // operación que necesita la base de verdad, como registrar un pedido.
  console.warn(
    "DATABASE_URL no está definida. El catálogo se sirve desde la copia en memoria.",
  );
}

/**
 * Las bases de datos gestionadas (Neon, Supabase, Railway) exigen TLS; un
 * PostgreSQL local normalmente no lo admite y rechaza la conexión.
 *
 * En lugar de adivinar, se comprueba una sola vez al arrancar: se intenta
 * abrir una conexión de comprobación con cifrado y, si el servidor dice que
 * no admite SSL, se reconfigura el pool sin cifrado.
 *
 * Reconfigurar el mismo pool —en vez de crear uno nuevo— mantiene la
 * instancia de Drizzle apuntando al objeto correcto y evita que alguna
 * consulta en vuelo quede ligada a un pool cerrado.
 *
 * `DISABLE_DB_SSL=1` o `sslmode=disable` en la URL fuerzan el modo sin TLS.
 */
const sslForcedOff =
  process.env.DISABLE_DB_SSL === "1" ||
  (databaseUrl ? /sslmode=disable/.test(databaseUrl) : false);

let sslEnabled = !sslForcedOff;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: ReturnType<typeof drizzle>;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    // Si falta DATABASE_URL se usa una URL local: el pool no se abrirá nunca
    // porque todas las consultas fallarán antes, y así el build puede
    // completarse sin abortar.
    connectionString:
      databaseUrl ?? "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    // Evita que una consulta colgada bloquee el servidor de páginas.
    connectionTimeoutMillis: 20_000,
    idleTimeoutMillis: 30_000,
  });

pool.on("error", (error: Error) => {
  // Un error de conexión no debe tumbar el proceso: se registra y el pool
  // sigue intentando. El catálogo tiene un respaldo en memoria.
  console.error("Error de la conexión a la base de datos:", error.message);
});

export const db = globalForDb.__arenaNextJsPostgresqlDb ?? drizzle(pool);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
  globalForDb.__arenaNextJsPostgresqlDb = db;
}

/**
 * Comprueba si el servidor admite conexiones cifradas.
 *
 * Devuelve `true` cuando el TLS está bien (o no hace falta), y `false` solo
 * cuando el servidor lo rechaza de forma explícita.
 */
async function serverSupportsSsl(): Promise<boolean> {
  if (sslForcedOff) return false;
  if (!databaseUrl) return false;
  const probe = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10_000,
  });
  try {
    await probe.connect();
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/does not support SSL/i.test(message)) throw error;
    return false;
  } finally {
    await probe.end().catch(() => {});
  }
}

let sslChecked: Promise<void> | undefined;

/**
 * Verifica que la base de datos responde y ajusta el pool si el servidor no
 * admite TLS. Se usa en `/api/health` y antes de la siembra del catálogo.
 */
export async function checkDatabase(): Promise<{ ok: boolean; detail?: string }> {
  if (!sslChecked) {
    sslChecked = (async () => {
      const supported = await serverSupportsSsl().catch(() => true);
      if (supported) return;
      sslEnabled = false;
      // Se reconfigura el pool existente: no se crea otro ni se cierra este,
      // de modo que las referencias ya importadas siguen siendo válidas.
      (pool as unknown as { options: { ssl?: unknown } }).options.ssl = false;
      console.warn("El servidor no admite TLS. Se continúa sin cifrado.");
    })();
  }
  await sslChecked.catch(() => {});

  try {
    await pool.query("select 1");
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}
