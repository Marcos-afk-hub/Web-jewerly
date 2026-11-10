import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export type ProductVariantGroup = {
  name: string;
  options: string[];
};

export type ProductCustomization = {
  label: string;
  placeholder: string;
  maxLength: number;
  extraCost: number;
};

export type MemoriaDesignRecord = {
  product: string;
  material: string;
  tone: string;
  chain: string;
  shape: string;
  stone: string;
  charm: string;
  finish: string;
  textileType: string;
  textileDescription: string;
  piecesFromGarment: number;
  occasion: string;
  notes: string;
};

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 180 }).notNull(),
    category: varchar("category", { length: 60 }).notNull(),
    line: varchar("line", { length: 30 }).notNull().default("clasica"),
    collectionName: varchar("collection_name", { length: 80 }).notNull(),
    shortDescription: varchar("short_description", { length: 280 }).notNull(),
    description: text("description").notNull(),
    story: text("story").notNull(),
    images: text("images").array().notNull(),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    badge: varchar("badge", { length: 80 }),
    materials: varchar("materials", { length: 240 }).notNull(),
    materialKey: varchar("material_key", { length: 40 }).notNull(),
    style: varchar("style", { length: 40 }).notNull(),
    features: text("features").array().notNull(),
    variants: jsonb("variants").$type<ProductVariantGroup[]>().notNull(),
    customization: jsonb("customization").$type<ProductCustomization | null>(),
    stock: integer("stock").notNull().default(0),
    leadTime: varchar("lead_time", { length: 120 }).notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_line_idx").on(table.line),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    location: varchar("location", { length: 120 }).notNull(),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reviews_product_idx").on(table.productId),
    uniqueIndex("reviews_product_customer_body_unique").on(
      table.productId,
      table.customerName,
      table.body,
    ),
  ],
);

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  whatsappOptIn: boolean("whatsapp_opt_in").notNull().default(true),
  city: varchar("city", { length: 120 }),
  state: varchar("state", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: varchar("order_number", { length: 32 }).notNull().unique(),
    customerId: integer("customer_id").references(() => customers.id),
    fullName: varchar("full_name", { length: 180 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    address: varchar("address", { length: 240 }),
    apartment: varchar("apartment", { length: 120 }),
    city: varchar("city", { length: 120 }),
    state: varchar("state", { length: 120 }),
    postalCode: varchar("postal_code", { length: 12 }),
    notes: text("notes"),
    paymentMethod: varchar("payment_method", { length: 40 }).notNull(),
    deliveryMethod: varchar("delivery_method", { length: 40 }).notNull(),
    pickupPoint: varchar("pickup_point", { length: 80 }),
    garmentMethod: varchar("garment_method", { length: 40 }),
    hasMemoria: boolean("has_memoria").notNull().default(false),
    subtotal: integer("subtotal").notNull(),
    shipping: integer("shipping").notNull(),
    total: integer("total").notNull(),
    status: varchar("status", { length: 40 }).notNull().default("confirmado"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_email_idx").on(table.email),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id),
    kind: varchar("kind", { length: 20 }).notNull().default("producto"),
    productName: varchar("product_name", { length: 180 }).notNull(),
    productSlug: varchar("product_slug", { length: 120 }).notNull(),
    variant: varchar("variant", { length: 160 }),
    engraving: varchar("engraving", { length: 80 }),
    memoryNote: text("memory_note"),
    design: jsonb("design").$type<MemoriaDesignRecord | null>(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export const orderEvents = pgTable(
  "order_events",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 40 }).notNull(),
    note: text("note"),
    channel: varchar("channel", { length: 40 }).notNull().default("registro"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("order_events_order_idx").on(table.orderId)],
);
