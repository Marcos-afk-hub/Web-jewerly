-- Esquema inicial de HILO MÍO · Memoria
-- Generado con drizzle-kit. Aplicar con: npm run db:push

CREATE TABLE IF NOT EXISTS "products" (
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
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "product_id" integer NOT NULL,
  "customer_name" varchar(120) NOT NULL,
  "location" varchar(120) NOT NULL,
  "rating" integer NOT NULL,
  "title" varchar(180) NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
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
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
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
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
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
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "order_id" integer NOT NULL,
  "status" varchar(40) NOT NULL,
  "note" text,
  "channel" varchar(40) DEFAULT 'registro' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_line_idx" ON "products" USING btree ("line");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_product_idx" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_product_customer_body_unique" ON "reviews" USING btree ("product_id","customer_name","body");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_email_idx" ON "orders" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_events_order_idx" ON "order_events" USING btree ("order_id");
