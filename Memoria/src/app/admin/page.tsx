import type { Metadata } from "next";
import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { customers, orderItems, orders, products } from "@/db/schema";
import { isAdminAuthenticated, isUsingDemoPassword } from "@/lib/admin-auth";
import { ensureCatalogSeeded } from "@/lib/catalog";
import { categoryName, whatsappLink } from "@/lib/catalog-config";
import { deliveryName, garmentName, orderStatuses, paymentName, pickupPointName, statusLabel } from "@/lib/fulfillment";
import { formatDateTime, formatPrice } from "@/lib/format";
import { loginAction, logoutAction, updateOrderStatusAction, updateProductAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel administrativo",
  robots: { index: false, follow: false },
};

type AdminPageProps = {
  searchParams: Promise<{ error?: string; ok?: string }>;
};

const integrations = [
  { name: "Pasarela de pagos", service: "Stripe o Mercado Pago", env: "STRIPE_SECRET_KEY / MP_ACCESS_TOKEN", status: "Pendiente" },
  { name: "Correos transaccionales", service: "Resend", env: "RESEND_API_KEY", status: process.env.RESEND_API_KEY ? "Activo" : "Pendiente" },
  { name: "WhatsApp Business", service: "Meta Cloud API o Twilio", env: "NEXT_PUBLIC_WHATSAPP_NUMBER", status: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? "Número configurado" : "Número de demostración" },
  { name: "Guías de paquetería", service: "FedEx Ship API", env: "FEDEX_CLIENT_ID / FEDEX_CLIENT_SECRET", status: "Pendiente" },
  { name: "Mensajería local", service: "Uber Direct", env: "UBER_DIRECT_CLIENT_ID", status: "Evaluación" },
];

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { error, ok } = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="admin-login">
        <form className="admin-login__card" action={loginAction}>
          <span className="eyebrow">HILO MÍO · Administración</span>
          <h1>Acceso al panel</h1>
          <p>Gestiona productos, inventario, pedidos y clientes.</p>
          {error === "credenciales" ? <div className="checkout-error" role="alert"><span aria-hidden="true">!</span>Contraseña incorrecta.</div> : null}
          <label className="form-field"><span>Contraseña</span><input name="password" type="password" required autoComplete="current-password" /></label>
          <button type="submit" className="button button--primary">Entrar</button>
          {isUsingDemoPassword() ? <small>Contraseña de demostración: <code>hilomio-admin</code>. Define <code>ADMIN_PASSWORD</code> en el entorno para cambiarla.</small> : null}
          <Link href="/" className="text-link">Volver a la tienda <span aria-hidden="true">→</span></Link>
        </form>
      </main>
    );
  }

  await ensureCatalogSeeded();
  const [orderRows, itemRows, productRows, customerRows] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(60),
    db.select().from(orderItems),
    db.select().from(products).orderBy(asc(products.category), asc(products.name)),
    db
      .select({
        customer: customers,
        ordersCount: sql<number>`(select count(*) from ${orders} where ${orders.customerId} = ${customers.id})`,
        spent: sql<number>`(select coalesce(sum(${orders.total}), 0) from ${orders} where ${orders.customerId} = ${customers.id})`,
      })
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(60),
  ]);

  const itemsByOrder = new Map<number, typeof itemRows>();
  for (const item of itemRows) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  const revenue = orderRows.reduce((total, order) => total + order.total, 0);
  const memoriaPending = orderRows.filter((order) => order.hasMemoria && order.status !== "entregado").length;
  const lowStock = productRows.filter((product) => product.line !== "memoria" && product.stock <= 5).length;

  return (
    <main className="admin-page">
      <div className="container">
        <header className="admin-header">
          <div><span className="eyebrow">HILO MÍO · Administración</span><h1>Panel de control</h1></div>
          <div className="admin-header__actions">
            <Link href="/" className="text-link">Ver tienda <span aria-hidden="true">→</span></Link>
            <form action={logoutAction}><button type="submit" className="button button--ghost">Cerrar sesión</button></form>
          </div>
        </header>

        {ok ? <div className="admin-notice" role="status">Cambios guardados correctamente{ok !== "producto" ? ` para el pedido ${ok}` : ""}.</div> : null}
        {error && error !== "credenciales" ? <div className="checkout-error" role="alert"><span aria-hidden="true">!</span>No se pudo guardar el cambio. Revisa los datos e inténtalo de nuevo.</div> : null}

        <section className="admin-kpis">
          <div><span>Pedidos registrados</span><strong>{orderRows.length}</strong></div>
          <div><span>Ventas acumuladas</span><strong>{formatPrice(revenue)}</strong></div>
          <div><span>Pedidos MEMORIA activos</span><strong>{memoriaPending}</strong></div>
          <div><span>Productos con bajo inventario</span><strong>{lowStock}</strong></div>
          <div><span>Clientes</span><strong>{customerRows.length}</strong></div>
        </section>

        <section className="admin-section" id="pedidos">
          <div className="admin-section__heading"><h2>Pedidos</h2><p>Actualiza el estatus; cada cambio queda en la bitácora y notifica al cliente por correo (si Resend está configurado) y por WhatsApp con un clic.</p></div>
          {orderRows.length === 0 ? <p className="admin-empty">Aún no hay pedidos. Cuando un cliente compre, aparecerá aquí.</p> : null}
          <div className="admin-orders">
            {orderRows.map((order) => {
              const items = itemsByOrder.get(order.id) ?? [];
              const message = `Hola ${order.fullName.split(" ")[0]}, te escribimos de HILO MÍO sobre tu pedido ${order.orderNumber}. Estatus actual: ${statusLabel(order.status)}.`;
              return (
                <article className="admin-order" key={order.id}>
                  <div className="admin-order__main">
                    <div className="admin-order__title">
                      <strong>{order.orderNumber}</strong>
                      <span className={`status-pill status-pill--${order.status}`}>{statusLabel(order.status)}</span>
                      {order.hasMemoria ? <span className="status-pill status-pill--memoria">MEMORIA</span> : null}
                    </div>
                    <p className="admin-order__meta">{formatDateTime(order.createdAt.toISOString())} · {order.fullName} · {order.email} · {order.phone}</p>
                    <p className="admin-order__meta">{deliveryName(order.deliveryMethod)}{order.pickupPoint ? ` (${pickupPointName(order.pickupPoint)})` : ""}{order.address ? ` · ${order.address}, ${order.city}, ${order.state} ${order.postalCode}` : ""} · {paymentName(order.paymentMethod)}{order.hasMemoria ? ` · Prenda: ${garmentName(order.garmentMethod)}` : ""}</p>
                    <ul className="admin-order__items">
                      {items.map((item) => (
                        <li key={item.id}>
                          <span>{item.quantity} × {item.productName}</span>
                          {item.variant ? <small>{item.variant}</small> : null}
                          {item.engraving ? <small>Grabado: “{item.engraving}”</small> : null}
                          {item.design ? <small>Diseño: {item.design.material} · {item.design.tone} · {item.design.shape} · {item.design.stone} · {item.design.charm} · {item.design.finish} · Textil: {item.design.textileType} — {item.design.textileDescription}{item.design.notes ? ` · Notas: ${item.design.notes}` : ""}</small> : null}
                          <b>{formatPrice(item.unitPrice * item.quantity)}</b>
                        </li>
                      ))}
                    </ul>
                    {order.notes ? <p className="admin-order__notes">Notas del cliente: {order.notes}</p> : null}
                    <p className="admin-order__total">Total: <strong>{formatPrice(order.total)}</strong> <small>(envío {formatPrice(order.shipping)})</small></p>
                  </div>
                  <form className="admin-order__form" action={updateOrderStatusAction}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <label><span>Nuevo estatus</span>
                      <select name="status" defaultValue={order.status}>
                        {orderStatuses.filter((status) => order.hasMemoria || !status.memoriaOnly).map((status) => <option key={status.id} value={status.id}>{status.label}</option>)}
                      </select>
                    </label>
                    <label><span>Nota para el cliente</span><input name="note" maxLength={400} placeholder="Ej. Tu guía FedEx es 7489 1234 5678" /></label>
                    <div className="admin-order__buttons">
                      <button type="submit" className="button button--primary">Actualizar estatus</button>
                      <a className="button button--ghost" href={whatsappLink(message)} target="_blank" rel="noreferrer">Notificar por WhatsApp</a>
                    </div>
                  </form>
                </article>
              );
            })}
          </div>
        </section>

        <section className="admin-section" id="productos">
          <div className="admin-section__heading"><h2>Productos e inventario</h2><p>Edita precio, existencias, destacados y el contenido de cada pieza. Los cambios se reflejan de inmediato en la tienda.</p></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Producto</th><th>Categoría</th><th>Precio (MXN)</th><th>Inventario</th><th>Destacado</th><th /></tr></thead>
              <tbody>
                {productRows.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong><br /><small>{product.slug} · {product.materials}</small></td>
                    <td>{categoryName(product.category)}{product.line === "memoria" ? " · MEMORIA" : ""}</td>
                    <td colSpan={4}>
                      <form className="admin-inline-form" action={updateProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <input name="price" type="number" min="0" step="10" defaultValue={product.price} aria-label={`Precio de ${product.name}`} />
                        <input name="stock" type="number" min="0" step="1" defaultValue={product.stock} aria-label={`Inventario de ${product.name}`} className={product.stock <= 5 && product.line !== "memoria" ? "is-low" : undefined} />
                        <label className="admin-check"><input name="featured" type="checkbox" defaultChecked={product.featured} /> Destacado</label>
                        <button type="submit" className="button button--ghost">Guardar</button>
                      </form>
                      <details className="admin-product-editor">
                        <summary>Editar contenido</summary>
                        <form className="admin-product-form" action={updateProductAction}>
                          <input type="hidden" name="productId" value={product.id} />
                          <input type="hidden" name="price" value={product.price} />
                          <input type="hidden" name="stock" value={product.stock} />
                          <input type="hidden" name="featured" value={product.featured ? "on" : ""} />
                          <label className="form-field form-field--full">
                            <span>Nombre</span>
                            <input name="name" defaultValue={product.name} maxLength={180} />
                          </label>
                          <label className="form-field form-field--full">
                            <span>Descripción corta</span>
                            <input name="shortDescription" defaultValue={product.shortDescription} maxLength={280} />
                          </label>
                          <label className="form-field form-field--full">
                            <span>Descripción</span>
                            <textarea name="description" rows={3} defaultValue={product.description} />
                          </label>
                          <label className="form-field form-field--full">
                            <span>Historia de la pieza</span>
                            <textarea name="story" rows={2} defaultValue={product.story} />
                          </label>
                          <label className="form-field">
                            <span>Etiqueta</span>
                            <input name="badge" defaultValue={product.badge ?? ""} maxLength={80} placeholder="Sin etiqueta" />
                          </label>
                          <label className="form-field">
                            <span>Tiempo de elaboración</span>
                            <input name="leadTime" defaultValue={product.leadTime} maxLength={120} />
                          </label>
                          <button type="submit" className="button button--primary">Guardar contenido</button>
                        </form>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-section" id="clientes">
          <div className="admin-section__heading"><h2>Clientes</h2><p>Se registran automáticamente al comprar. Incluye su preferencia de notificaciones por WhatsApp.</p></div>
          {customerRows.length === 0 ? <p className="admin-empty">Todavía no hay clientes registrados.</p> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Cliente</th><th>Contacto</th><th>Ubicación</th><th>Pedidos</th><th>Total</th><th>WhatsApp</th></tr></thead>
                <tbody>
                  {customerRows.map(({ customer, ordersCount, spent }) => (
                    <tr key={customer.id}>
                      <td><strong>{customer.fullName}</strong><br /><small>Desde {formatDateTime(customer.createdAt.toISOString())}</small></td>
                      <td>{customer.email}<br /><small>{customer.phone}</small></td>
                      <td>{[customer.city, customer.state].filter(Boolean).join(", ") || "—"}</td>
                      <td>{Number(ordersCount)}</td>
                      <td>{formatPrice(Number(spent))}</td>
                      <td>{customer.whatsappOptIn ? "Acepta" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-section" id="integraciones">
          <div className="admin-section__heading"><h2>Integraciones externas</h2><p>Servicios necesarios para activar funciones avanzadas. Se configuran con variables de entorno, sin tocar el código.</p></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Función</th><th>Servicio</th><th>Variable</th><th>Estado</th></tr></thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr key={integration.name}><td>{integration.name}</td><td>{integration.service}</td><td><code>{integration.env}</code></td><td>{integration.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
