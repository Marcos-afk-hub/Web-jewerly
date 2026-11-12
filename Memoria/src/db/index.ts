import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL es obligatoria. Copia .env.example a .env.local y define la cadena de conexión a PostgreSQL.",
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Las bases de datos gestionadas (Neon, Supabase, Railway) exigen TLS.
    // En local, donde el servidor corre sin certificado, se respeta
    // `sslmode=disable` en la URL o se desactiva con DISABLE_DB_SSL=1.
    ssl:
      process.env.DISABLE_DB_SSL === "1" || /sslmode=disable/.test(databaseUrl)
        ? false
        : { rejectUnauthorized: false },
    // Evita que una consulta colgada bloquee el servidor de páginas.
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
