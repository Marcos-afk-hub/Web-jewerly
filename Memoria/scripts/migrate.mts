/**
 * Aplica el esquema a la base de datos en producción.
 *
 * En desarrollo usamos `drizzle-kit push`, que es cómodo pero no lleva control
 * de cambios: hace un diff entre el esquema del código y el de la base y
 * aplica lo que falte. En producción eso es arriesgado, porque un `push`
 * accidental puede modificar o borrar columnas.
 *
 * Este script usa el cliente de Drizzle en lugar de `drizzle-kit`, y solo
 * ejecuta sentencias `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT
 * EXISTS`: es idempotente y nunca destruye datos.
 *
 *   npm run db:migrate
 */
import { Client } from "pg";

const statements = [
  `CREATE TABLE IF NOT EXISTS "products" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar(120) NOT NULL,
    "name" varchar(180) NOT NULL,
    "category" varchar(60) NOT NULL,
    "line" varchar(30) DEFAULT 'clasica' NOT NULL,
    "collection_name" varchar(80) NOT NULL,
    "short_description" varchar(280) NOT NULL,
    "description" text NOT NULL,
    "story" text NOT NULL,
    "images" text[] NOT NULL,
    "price" integer NOT NULL,
    "compare_at_price" integer,
    "badge" varchar(80),
    "materials" varchar(240) NOT NULL,
    "material_key" varchar(40) NOT NULL,
    "style" varchar(40) NOT NULL,
    "features" text[] NOT NULL,
    "variants" jsonb NOT NULL,
    "customization" jsonb,
    "stock" integer DEFAULT 0 NOT NULL,
    "lead_time" varchar(120) NOT NULL,
    "featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "products_slug_unique" UNIQUE("slug")
  )`,
  `CREATE TABLE IF NOT EXISTS "reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "customer_name" varchar(120) NOT NULL,
    "location" varchar(120) NOT NULL,
    "rating" integer NOT NULL,
    "title" varchar(180) NOT NULL,
    "body" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "customers" (
    "id" serial PRIMARY KEY NOT NULL,
    "email" varchar(254) NOT NULL,
    "full_name" varchar(180) NOT NULL,
    "phone" varchar(40) NOT NULL,
    "whatsapp_opt_in" boolean DEFAULT true NOT NULL,
    "city" varchar(120),
    "state" varchar(120),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "customers_email_unique" UNIQUE("email")
  )`,
  `CREATE TABLE IF NOT EXISTS "orders" (
    "id" serial PRIMARY KEY NOT NULL,
    "order_number" varchar(32) NOT NULL,
    "customer_id" integer,
    "full_name" varchar(180) NOT NULL,
    "email" varchar(254) NOT NULL,
    "phone" varchar(40) NOT NULL,
    "address" varchar(240),
    "apartment" varchar(120),
    "city" varchar(120),
    "state" varchar(120),
    "postal_code" varchar(12),
    "notes" text,
    "payment_method" varchar(40) NOT NULL,
    "delivery_method" varchar(40) NOT NULL,
    "pickup_point" varchar(80),
    "garment_method" varchar(40),
    "has_memoria" boolean DEFAULT false NOT NULL,
    "subtotal" integer NOT NULL,
    "shipping" integer NOT NULL,
    "total" integer NOT NULL,
    "status" varchar(40) DEFAULT 'confirmado' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
  )`,
  `CREATE TABLE IF NOT EXISTS "order_items" (
    "id" serial PRIMARY KEY NOT NULL,
    "order_id" integer NOT NULL,
    "product_id" integer,
    "kind" varchar(20) DEFAULT 'producto' NOT NULL,
    "product_name" varchar(180) NOT NULL,
    "product_slug" varchar(120) NOT NULL,
    "variant" varchar(160),
    "engraving" varchar(80),
    "memory_note" text,
    "design" jsonb,
    "unit_price" integer NOT NULL,
    "quantity" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "order_events" (
    "id" serial PRIMARY KEY NOT NULL,
    "order_id" integer NOT NULL,
    "status" varchar(40) NOT NULL,
    "note" text,
    "channel" varchar(40) DEFAULT 'registro' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  )`,
  `DO $$ BEGIN
    ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk"
      FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$`,
  `DO $$ BEGIN
    ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk"
      FOREIGN KEY ("customer_id") REFERENCES "customers"("id");
   EXCEPTION WHEN duplicate_object THEN null;
   END $$`,
  `DO $$ BEGIN
    ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk"
      FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$`,
  `DO $$ BEGIN
    ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk"
      FOREIGN KEY ("product_id") REFERENCES "products"("id");
   EXCEPTION WHEN duplicate_object THEN null;
   END $$`,
  `DO $$ BEGIN
    ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_orders_id_fk"
      FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade;
   EXCEPTION WHEN duplicate_object THEN null;
   END $$`,
  `CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category")`,
  `CREATE INDEX IF NOT EXISTS "products_line_idx" ON "products" ("line")`,
  `CREATE INDEX IF NOT EXISTS "reviews_product_idx" ON "reviews" ("product_id")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "reviews_product_customer_body_unique" ON "reviews" ("product_id","customer_name","body")`,
  `CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" ("created_at")`,
  `CREATE INDEX IF NOT EXISTS "orders_email_idx" ON "orders" ("email")`,
  `CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" ("order_id")`,
  `CREATE INDEX IF NOT EXISTS "order_events_order_idx" ON "order_events" ("order_id")`,
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  // En Vercel, si la base no está alcanzable desde la red de build, es
  // preferible publicar el sitio y aplicar el esquema desde otro lado
  // (panel de Neon, un deploy manual o `npm run db:migrate` local) que
  // dejar el despliegue entero en rojo.
  const allowFailure = process.env.ALLOW_DB_MIGRATION_FAILURE === "1";

  if (!databaseUrl) {
    if (!allowFailure) {
      throw new Error("DATABASE_URL es obligatoria para ejecutar las migraciones.");
    }
    console.warn(
      "⚠ DATABASE_URL no está definida. Se continúa sin aplicar el esquema.",
    );
    process.exit(0);
  }

  // Las bases gestionadas (Neon, Supabase) exigen TLS; las locales no.
  // Se intenta con TLS y, si el servidor lo rechaza, se reintenta sin él.
  // `DISABLE_DB_SSL=1` o `sslmode=disable` en la URL fuerza el modo sin TLS.
  const forceNoSsl =
    process.env.DISABLE_DB_SSL === "1" || /sslmode=disable/.test(databaseUrl);

  const connect = (useSsl: boolean) =>
    new Client({
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 20_000,
    });

  let activeClient: Client | undefined;

  try {
    activeClient = connect(!forceNoSsl);
    await activeClient.connect();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!forceNoSsl && /does not support SSL/i.test(message)) {
      console.log("→ El servidor no admite TLS. Reintentando sin cifrado…");
      try {
        activeClient = connect(false);
        await activeClient.connect();
      } catch (retryError) {
        const retryMessage =
          retryError instanceof Error ? retryError.message : String(retryError);
        if (!allowFailure) throw retryError;
        console.warn(
          "⚠ No se pudo conectar a la base de datos. Se continúa sin aplicar el esquema.",
        );
        console.warn(`  Motivo: ${retryMessage.split("\n")[0]}`);
        process.exit(0);
      }
    } else if (allowFailure) {
      console.warn(
        "⚠ No se pudo conectar a la base de datos. Se continúa sin aplicar el esquema.",
      );
      console.warn(`  Motivo: ${message.split("\n")[0]}`);
      process.exit(0);
    } else {
      throw error;
    }
  }

  console.log("→ Aplicando esquema…");

  for (const statement of statements) {
    try {
      await activeClient.query(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!allowFailure) throw error;
      console.warn(`⚠ No se pudo aplicar una sentencia: ${message.split("\n")[0]}`);
    }
  }

  const { rows } = await activeClient.query<{ table_name: string }>(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
  );
  console.log("✓ Esquema aplicado. Tablas:", rows.map((row) => row.table_name).join(", "));
  await activeClient.end();
}

main().catch((error) => {
  console.error("✗ Error aplicando el esquema:", error);
  process.exit(1);
});
