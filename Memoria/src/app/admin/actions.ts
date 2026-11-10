"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orderEvents, orders, products } from "@/db/schema";
import { ADMIN_COOKIE, adminSessionToken, getAdminPassword, isAdminAuthenticated } from "@/lib/admin-auth";
import { orderStatuses } from "@/lib/fulfillment";
import { sendNotification, statusChangeMessage } from "@/lib/notifications";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== getAdminPassword()) {
    redirect("/admin?error=credenciales");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function updateOrderStatusAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const orderId = Number(formData.get("orderId"));
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 400);
  if (!Number.isInteger(orderId) || !orderStatuses.some((item) => item.id === status)) {
    redirect("/admin?error=estatus");
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) redirect("/admin?error=pedido");

  const notification = await sendNotification({
    to: order.email,
    subject: `HILO MÍO · Actualización de tu pedido ${order.orderNumber}`,
    text: statusChangeMessage({ orderNumber: order.orderNumber, fullName: order.fullName, status, note: note || undefined }),
  });

  await db.transaction(async (tx) => {
    await tx.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, orderId));
    await tx.insert(orderEvents).values({
      orderId,
      status,
      note: note || null,
      channel: notification.sent ? "email" : "registro",
    });
  });

  revalidatePath("/admin");
  revalidatePath("/rastrear");
  redirect(`/admin?ok=${encodeURIComponent(order.orderNumber)}#pedidos`);
}

export async function updateProductAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const productId = Number(formData.get("productId"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const featured = formData.get("featured") === "on";
  if (!Number.isInteger(productId) || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    redirect("/admin?error=producto");
  }
  await db.update(products).set({ price: Math.round(price), stock, featured }).where(eq(products.id, productId));
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/catalogo");
  redirect("/admin?ok=producto#productos");
}
