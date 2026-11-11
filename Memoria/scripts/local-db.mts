/**
 * Base de datos PostgreSQL local para desarrollo.
 *
 * Usa `embedded-postgres` para levantar un Postgres real en el sandbox o en
 * cualquier máquina sin Docker ni instalación del sistema. Los datos viven en
 * `.pgdata/` (ignorado por git) y sobreviven entre reinicios.
 *
 *   npm run db:local      → arranca el servidor (dejar en una terminal)
 *   npm run db:local:stop → detiene el servidor
 *   npm run db:push       → aplica el esquema a la base de datos
 *   npm run db:studio     → abre Drizzle Studio
 *
 * Si ya tienes un PostgreSQL propio, ignora este script y basta con
 * exportar DATABASE_URL en `.env.local`.
 */
import EmbeddedPostgres from "embedded-postgres";
import { Client } from "pg";
import { existsSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), ".pgdata");
const PORT = Number(process.env.LOCAL_PG_PORT ?? 5432);
const USER = "postgres";
const PASSWORD = "postgres";
const DATABASE = "app_db";

/** URL de conexión que corresponde a esta instancia local. */
export const localDatabaseUrl = `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/${DATABASE}`;

function postgres(): EmbeddedPostgres {
  return new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    onLog: () => {},
    onError: (message: unknown) => {
      // `embedded-postgres` es verboso con los logs de arranque; solo interesan los errores.
      const text = String(message);
      if (/ERROR|FATAL/i.test(text)) console.error(text);
    },
  });
}

/** Crea la base de datos `app_db` si todavía no existe. */
async function ensureDatabase() {
  const client = new Client({
    host: "127.0.0.1",
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: "postgres",
  });
  await client.connect();
  try {
    const existing = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [DATABASE]);
    if (existing.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DATABASE}"`);
      console.log(`✓ Base de datos "${DATABASE}" creada`);
    } else {
      console.log(`✓ Base de datos "${DATABASE}" ya existía`);
    }
  } finally {
    await client.end();
  }
}

async function start() {
  const pg = postgres();
  if (!existsSync(DATA_DIR)) {
    console.log("→ Inicializando clúster PostgreSQL (solo la primera vez)...");
    await pg.initialise();
  }
  await pg.start();
  console.log(`→ PostgreSQL escuchando en 127.0.0.1:${PORT}`);
  await ensureDatabase();
  console.log(`\n✓ Base de datos lista. Usa esta URL en .env.local:\n\n  DATABASE_URL=${localDatabaseUrl}\n`);
  console.log("  Presiona Ctrl+C para detener el servidor.\n");

  const shutdown = async () => {
    console.log("\n→ Deteniendo PostgreSQL...");
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Mantiene el proceso vivo.
  await new Promise(() => {});
}

async function stop() {
  const pg = postgres();
  try {
    await pg.stop();
    console.log("✓ PostgreSQL detenido");
  } catch {
    console.log("→ No había ningún servidor corriendo.");
  }
}

async function psql<T>(query: string): Promise<T> {
  const client = new Client({
    host: "127.0.0.1",
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  });
  await client.connect();
  try {
    const result = await client.query(query);
    return result.rows as T;
  } finally {
    await client.end();
  }
}

const command = process.argv[2] ?? "start";

if (command === "start") {
  await start();
} else if (command === "stop") {
  await stop();
} else if (command === "sql") {
  const query = process.argv[3] ?? "select 1";
  console.log(await psql(query));
} else {
  console.error(`Comando desconocido: ${command}. Usa: start | stop | sql`);
  process.exit(1);
}
