import { randomUUID } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { customers, orderEvents, orderItems, orders, products } from "@/db/schema";
import type { MemoriaDesignRecord } from "@/db/schema";
import { ensureCatalogSeeded } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import {
  calculateDeliveryCost,
  calculateGarmentCost,
  deliveryMethods,
  garmentMethods,
  paymentMethods,
  pickupPoints,
} from "@/lib/fulfillment";
import { calculateMemoriaPrice, getMemoriaProduct, validateDesign } from "@/lib/memoria-options";
import { orderConfirmationMessage, sendNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";

type IncomingLine = {
  kind?: unknown;
  slug?: unknown;
  quantity?: unknown;
  variant?: unknown;
  engraving?: unknown;
  design?: unknown;
};

type IncomingOrder = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  apartment?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  notes?: unknown;
  paymentMethod?: unknown;
  deliveryMethod?: unknown;
  pickupPoint?: unknown;
  garmentMethod?: unknown;
  whatsappOptIn?: unknown;
  lines?: unknown;
};

type ResolvedLine = {
  kind: "producto" | "memoria";
  productId: number | null;
  name: string;
  slug: string;
  variant: string | null;
  engraving: string | null;
  design: MemoriaDesignRecord | null;
  unitPrice: number;
  quantity: number;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function jsonError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return jsonError("No pudimos leer los datos del pedido.", 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return jsonError("No pudimos leer los datos del pedido.", 400);
  }
  const input = parsed as IncomingOrder;

  const fullName = cleanText(input.fullName, 180);
  const email = cleanText(input.email, 254).toLowerCase();
  const phone = cleanText(input.phone, 40);
  const address = cleanText(input.address, 240);
  const apartment = cleanText(input.apartment, 120);
  const city = cleanText(input.city, 120);
  const state = cleanText(input.state, 120);
  const postalCode = cleanText(input.postalCode, 12);
  const notes = cleanText(input.notes, 1200);
  const paymentMethod = cleanText(input.paymentMethod, 40);
  const deliveryMethod = cleanText(input.deliveryMethod, 40);
  const pickupPoint = cleanText(input.pickupPoint, 80);
  const garmentMethodInput = cleanText(input.garmentMethod, 40);
  const whatsappOptIn = input.whatsappOptIn !== false;

  if (!fullName || !phone) return jsonError("Completa tu nombre y teléfono para continuar.", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("Escribe un correo electrónico válido.", 400);
  if (phone.replace(/\D/g, "").length < 10) return jsonError("Escribe un teléfono de al menos 10 dígitos.", 400);

  const delivery = deliveryMethods.find((method) => method.id === deliveryMethod);
  if (!delivery) return jsonError("Elige un método de entrega.", 400);
  if (delivery.id === "domicilio") {
    if (!address || !city || !state) return jsonError("Completa la dirección de envío.", 400);
    if (!/^\d{5}$/.test(postalCode)) return jsonError("Escribe un código postal de 5 dígitos.", 400);
  }
  if (delivery.id === "punto" && !pickupPoints.some((point) => point.id === pickupPoint)) {
    return jsonError("Elige el punto de encuentro para tu entrega.", 400);
  }

  const payment = paymentMethods.find((method) => method.id === paymentMethod);
  if (!payment || !payment.available) return jsonError("Elige una forma de pago disponible.", 400);
  if ("onlyFor" in payment && payment.onlyFor !== delivery.id) {
    return jsonError("El pago en establecimiento solo aplica si recoges tu pedido en HILO MÍO.", 400);
  }

  if (!Array.isArray(input.lines) || input.lines.length < 1 || input.lines.length > 25) {
    return jsonError("Tu bolsa no tiene piezas válidas.", 400);
  }

  try {
    await ensureCatalogSeeded();
    const rawLines = input.lines as IncomingLine[];
    const productSlugs = Array.from(
      new Set(rawLines.filter((line) => line.kind === "producto").map((line) => cleanText(line.slug, 120)).filter(Boolean)),
    );
    const catalogRows = productSlugs.length ? await db.select().from(products).where(inArray(products.slug, productSlugs)) : [];
    const productBySlug = new Map(catalogRows.map((product) => [product.slug, product]));
    const requestedStock = new Map<number, number>();
    const resolved: ResolvedLine[] = [];

    for (const line of rawLines) {
      const quantity = Number(line.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 12) {
        return jsonError("Revisa las cantidades de tu bolsa (máximo 12 por pieza).", 400);
      }
      if (line.kind === "memoria") {
        const design = validateDesign(line.design);
        const memoriaProduct = design ? getMemoriaProduct(design.product) : null;
        if (!design || !memoriaProduct) return jsonError("Uno de tus diseños MEMORIA no es válido. Vuelve a crearlo en el personalizador.", 400);
        resolved.push({
          kind: "memoria",
          productId: null,
          name: `MEMORIA · ${memoriaProduct.name}`,
          slug: `memoria-${design.product}`,
          variant: null,
          engraving: null,
          design,
          unitPrice: calculateMemoriaPrice(design),
          quantity,
        });
        continue;
      }
      if (line.kind !== "producto") return jsonError("Tu bolsa contiene un artículo no reconocido.", 400);
      const product = productBySlug.get(cleanText(line.slug, 120));
      if (!product) return jsonError("Una pieza de tu bolsa ya no está disponible. Actualiza la página e inténtalo de nuevo.", 409);
      const engraving = cleanText(line.engraving, 80);
      if (product.customization && !engraving) return jsonError(`Indica el texto a grabar para ${product.name}.`, 400);
      const alreadyRequested = requestedStock.get(product.id) ?? 0;
      if (product.stock < alreadyRequested + quantity) {
        return jsonError(`Solo quedan ${product.stock} piezas de ${product.name}.`, 409);
      }
      requestedStock.set(product.id, alreadyRequested + quantity);
      resolved.push({
        kind: "producto",
        productId: product.id,
        name: product.name,
        slug: product.slug,
        variant: cleanText(line.variant, 160) || null,
        engraving: product.customization ? engraving : null,
        design: null,
        unitPrice: product.price + (product.customization && engraving ? product.customization.extraCost : 0),
        quantity,
      });
    }

    const hasMemoria = resolved.some((line) => line.kind === "memoria");
    const garment = hasMemoria ? garmentMethods.find((method) => method.id === garmentMethodInput) : null;
    if (hasMemoria && !garment) return jsonError("Elige cómo nos harás llegar tu prenda para las piezas MEMORIA.", 400);

    const subtotal = resolved.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
    const shipping = calculateDeliveryCost(subtotal, delivery.id) + calculateGarmentCost(garment?.id);
    const total = subtotal + shipping;
    const orderNumber = `HM-${Date.now().toString(36).toUpperCase().slice(-5)}${randomUUID().slice(0, 4).toUpperCase()}`;

    const saved = await db.transaction(async (tx) => {
      const [customer] = await tx
        .insert(customers)
        .values({ email, fullName, phone, whatsappOptIn, city: city || null, state: state || null })
        .onConflictDoUpdate({
          target: customers.email,
          set: { fullName, phone, whatsappOptIn, city: city || null, state: state || null, updatedAt: new Date() },
        })
        .returning({ id: customers.id });

      const [created] = await tx
        .insert(orders)
        .values({
          orderNumber,
          customerId: customer?.id ?? null,
          fullName,
          email,
          phone,
          address: address || null,
          apartment: apartment || null,
          city: city || null,
          state: state || null,
          postalCode: postalCode || null,
          notes: notes || null,
          paymentMethod: payment.id,
          deliveryMethod: delivery.id,
          pickupPoint: delivery.id === "punto" ? pickupPoint : null,
          garmentMethod: garment?.id ?? null,
          hasMemoria,
          subtotal,
          shipping,
          total,
          status: "confirmado",
        })
        .returning({ id: orders.id, orderNumber: orders.orderNumber });

      await tx.insert(orderItems).values(
        resolved.map((line) => ({
          orderId: created.id,
          productId: line.productId,
          kind: line.kind,
          productName: line.name,
          productSlug: line.slug,
          variant: line.variant,
          engraving: line.engraving,
          design: line.design,
          unitPrice: line.unitPrice,
          quantity: line.quantity,
        })),
      );

      for (const [productId, quantity] of requestedStock) {
        await tx.update(products).set({ stock: sql`${products.stock} - ${quantity}` }).where(eq(products.id, productId));
      }

      const events = [{ orderId: created.id, status: "confirmado", note: `Pedido recibido. Pago: ${payment.name}.`, channel: "registro" }];
      if (hasMemoria) {
        events.push({ orderId: created.id, status: "pendiente_prenda", note: `Esperamos tu prenda vía ${garment?.name ?? "método por definir"}.`, channel: "registro" });
      }
      await tx.insert(orderEvents).values(events);
      if (hasMemoria) {
        await tx.update(orders).set({ status: "pendiente_prenda", updatedAt: new Date() }).where(eq(orders.id, created.id));
      }
      return created;
    });

    const notification = await sendNotification({
      to: email,
      subject: `HILO MÍO · Pedido ${saved.orderNumber} confirmado`,
      text: orderConfirmationMessage({ orderNumber: saved.orderNumber, fullName, total: formatPrice(total), hasMemoria, garmentMethod: garment?.id ?? null }),
    });

    return Response.json(
      {
        ok: true,
        orderNumber: saved.orderNumber,
        subtotal,
        shipping,
        total,
        hasMemoria,
        garmentMethod: garment?.id ?? null,
        deliveryMethod: delivery.id,
        paymentMethod: payment.id,
        emailSent: notification.sent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("No fue posible crear el pedido HILO MÍO", error);
    return jsonError("No pudimos guardar tu pedido. Inténtalo de nuevo en un momento.", 500);
  }
}
