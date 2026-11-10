import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderEvents, orderItems, orders } from "@/db/schema";
import { whatsappLink } from "@/lib/catalog-config";
import { deliveryName, garmentMethods, garmentName, paymentName, pickupPointName, stagesFor, statusLabel } from "@/lib/fulfillment";
import { formatDateTime, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rastrear pedido",
  description: "Consulta el estatus de tu pedido HILO MÍO o MEMORIA con tu número de pedido y correo electrónico.",
};

type TrackingPageProps = {
  searchParams: Promise<{ pedido?: string; correo?: string }>;
};

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
  const { pedido, correo } = await searchParams;
  const orderNumber = (pedido ?? "").trim().toUpperCase();
  const email = (correo ?? "").trim().toLowerCase();
  const searched = Boolean(orderNumber && email);

  const order = searched
    ? (await db.select().from(orders).where(and(eq(orders.orderNumber, orderNumber), eq(sql`lower(${orders.email})`, email))).limit(1))[0] ?? null
    : null;
  const [items, events] = order
    ? await Promise.all([
        db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
        db.select().from(orderEvents).where(eq(orderEvents.orderId, order.id)).orderBy(asc(orderEvents.createdAt)),
      ])
    : [[], []];

  const stages = order ? stagesFor(order.hasMemoria) : [];
  const currentIndex = order ? stages.findIndex((stage) => stage.id === order.status) : -1;
  const garment = order ? garmentMethods.find((method) => method.id === order.garmentMethod) : null;

  return (
    <main className="tracking-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Rastrear pedido</span></div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Seguimiento</span>
          <h1>¿Dónde va <em>mi pedido?</em></h1>
          <p>Ingresa tu número de pedido (lo encuentras en tu confirmación) y el correo con el que compraste.</p>
          <form className="tracking-form" method="get" action="/rastrear">
            <label><span>Número de pedido</span><input name="pedido" defaultValue={orderNumber} placeholder="HM-XXXXXXXXX" required /></label>
            <label><span>Correo electrónico</span><input name="correo" type="email" defaultValue={email} placeholder="tu@correo.com" required /></label>
            <button type="submit" className="button button--primary">Consultar</button>
          </form>
        </div>
      </section>

      <section className="container tracking-main">
        {searched && !order ? (
          <div className="empty-results">
            <span aria-hidden="true">✦</span>
            <h3>No encontramos ese pedido</h3>
            <p>Verifica el número y el correo. Si el problema continúa, escríbenos por WhatsApp con tu comprobante.</p>
            <a href={whatsappLink(`Hola HILO MÍO, no encuentro mi pedido ${orderNumber}.`)} target="_blank" rel="noreferrer" className="text-link">Escribir por WhatsApp <span aria-hidden="true">→</span></a>
          </div>
        ) : null}

        {order ? (
          <div className="tracking-layout">
            <div className="tracking-card">
              <div className="tracking-card__header">
                <div><span className="eyebrow">Pedido {order.orderNumber}</span><h2>{statusLabel(order.status)}</h2><p>Realizado el {formatDateTime(order.createdAt.toISOString())} · {order.hasMemoria ? "Incluye piezas MEMORIA" : "Joyería de catálogo"}</p></div>
                <span className="tracking-progress">{Math.max(currentIndex + 1, 1)} / {stages.length}</span>
              </div>
              <ol className="tracker">
                {stages.map((stage, index) => {
                  const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "pending";
                  return (
                    <li key={stage.id} className={`tracker__stage tracker__stage--${state}`}>
                      <span className="tracker__dot">{state === "done" ? "✓" : index + 1}</span>
                      <div><strong>{stage.label}</strong><p>{stage.description}</p></div>
                    </li>
                  );
                })}
              </ol>
              {order.status === "pendiente_prenda" && garment ? (
                <div className="tracking-garment">
                  <strong>Siguiente paso: {garment.name}</strong>
                  <ol>{garment.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                  <a href={whatsappLink(`Hola HILO MÍO, quiero coordinar la entrega de mi prenda para el pedido ${order.orderNumber}.`)} target="_blank" rel="noreferrer" className="text-link">Coordinar por WhatsApp <span aria-hidden="true">→</span></a>
                </div>
              ) : null}
            </div>

            <aside className="tracking-side">
              <div className="tracking-box">
                <h3>Historial de notificaciones</h3>
                <ul className="tracking-events">
                  {events.map((event) => (
                    <li key={event.id}><time dateTime={event.createdAt.toISOString()}>{formatDateTime(event.createdAt.toISOString())}</time><strong>{statusLabel(event.status)}</strong>{event.note ? <span>{event.note}</span> : null}</li>
                  ))}
                </ul>
              </div>
              <div className="tracking-box">
                <h3>Detalle del pedido</h3>
                <ul className="tracking-items">
                  {items.map((item) => (
                    <li key={item.id}><span>{item.quantity} × {item.productName}</span><span>{formatPrice(item.unitPrice * item.quantity)}</span>{item.variant ? <small>{item.variant}</small> : null}{item.engraving ? <small>Grabado: “{item.engraving}”</small> : null}</li>
                  ))}
                </ul>
                <dl className="tracking-meta">
                  <div><dt>Entrega</dt><dd>{deliveryName(order.deliveryMethod)}{order.pickupPoint ? ` · ${pickupPointName(order.pickupPoint)}` : ""}</dd></div>
                  {order.hasMemoria ? <div><dt>Prenda</dt><dd>{garmentName(order.garmentMethod)}</dd></div> : null}
                  <div><dt>Pago</dt><dd>{paymentName(order.paymentMethod)}</dd></div>
                  <div><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
                </dl>
              </div>
            </aside>
          </div>
        ) : null}

        {!searched ? (
          <div className="tracking-info">
            <h2>Así funciona el seguimiento</h2>
            <p>Cada pedido avanza por etapas claras. Las piezas MEMORIA incluyen etapas adicionales para la recepción de tu prenda.</p>
            <div className="tracking-info__grid">
              {stagesFor(true).map((stage, index) => (
                <div key={stage.id}><span>0{index + 1}</span><strong>{stage.label}</strong><p>{stage.description}</p></div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
