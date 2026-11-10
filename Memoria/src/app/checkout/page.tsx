"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "@/components/store-provider";
import { FREE_SHIPPING_THRESHOLD, whatsappLink } from "@/lib/catalog-config";
import { calculateDeliveryCost, calculateGarmentCost, deliveryMethods, garmentMethods, paymentMethods, pickupPoints } from "@/lib/fulfillment";
import { formatPrice } from "@/lib/format";

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
  deliveryMethod: string;
  pickupPoint: string;
  garmentMethod: string;
  paymentMethod: string;
  whatsappOptIn: boolean;
};

type OrderResponse = {
  ok?: boolean;
  message?: string;
  orderNumber?: string;
  total?: number;
  hasMemoria?: boolean;
  garmentMethod?: string | null;
  deliveryMethod?: string;
  paymentMethod?: string;
  emailSent?: boolean;
};

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "Estado de México",
  postalCode: "",
  notes: "",
  deliveryMethod: "domicilio",
  pickupPoint: pickupPoints[0].id,
  garmentMethod: "fedex",
  paymentMethod: "spei",
  whatsappOptIn: true,
};

export default function CheckoutPage() {
  const { cart, subtotal, hasMemoria, isCartReady, clearCart } = useStore();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState<OrderResponse | null>(null);

  const deliveryCost = calculateDeliveryCost(subtotal, form.deliveryMethod);
  const garmentCost = hasMemoria ? calculateGarmentCost(form.garmentMethod) : 0;
  const total = subtotal + deliveryCost + garmentCost;
  const availablePayments = useMemo(
    () => paymentMethods.filter((method) => !("onlyFor" in method) || method.onlyFor === form.deliveryMethod),
    [form.deliveryMethod],
  );

  const updateField = <Key extends keyof CheckoutForm>(field: Key, value: CheckoutForm[Key]) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "deliveryMethod" && value !== "tienda" && current.paymentMethod === "tienda") next.paymentMethod = "spei";
      return next;
    });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          garmentMethod: hasMemoria ? form.garmentMethod : null,
          lines: cart.map((line) => ({ kind: line.kind, slug: line.slug, quantity: line.quantity, variant: line.variant, engraving: line.engraving, design: line.design })),
        }),
      });
      const result = (await response.json()) as OrderResponse;
      if (!response.ok || !result.orderNumber) {
        throw new Error(result.message || "No pudimos registrar tu pedido. Revisa tus datos e inténtalo de nuevo.");
      }
      setConfirmation(result);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isCartReady) {
    return <main className="checkout-page"><div className="checkout-loading container"><span className="loading-flower" aria-hidden="true">✦</span><p>Preparando tu bolsa…</p></div></main>;
  }

  if (confirmation) {
    const garment = garmentMethods.find((method) => method.id === confirmation.garmentMethod);
    const trackingHref = `/rastrear?pedido=${encodeURIComponent(confirmation.orderNumber ?? "")}&correo=${encodeURIComponent(form.email)}`;
    return (
      <main className="checkout-page checkout-page--confirmation">
        <section className="order-confirmation container" aria-live="polite">
          <span className="confirmation-flower" aria-hidden="true">✓</span>
          <span className="eyebrow">Pedido confirmado</span>
          <h1>Gracias, {form.fullName.split(" ")[0]}.<br /><em>Tu pedido está en marcha.</em></h1>
          <div className="confirmation-number"><span>Número de pedido</span><strong>{confirmation.orderNumber}</strong></div>
          <p>{confirmation.emailSent ? "Te enviamos la confirmación por correo." : "Guarda tu número de pedido: lo necesitas para dar seguimiento en línea."} Total: <strong>{formatPrice(confirmation.total ?? total)}</strong>.</p>

          <div className="next-steps">
            {confirmation.paymentMethod === "spei" ? (
              <div className="next-step"><span>1</span><div><strong>Realiza tu transferencia SPEI</strong><p>Te compartimos la CLABE y referencia por correo y WhatsApp. Tu pedido entra a producción al validar el pago (normalmente el mismo día).</p></div></div>
            ) : (
              <div className="next-step"><span>1</span><div><strong>Paga al recoger</strong><p>Puedes pagar en efectivo o con tarjeta en nuestro establecimiento de Metepec cuando tu pedido esté listo.</p></div></div>
            )}
            {confirmation.hasMemoria && garment ? (
              <div className="next-step"><span>2</span><div><strong>Haznos llegar tu prenda: {garment.name}</strong><ol>{garment.steps.map((step) => <li key={step}>{step}</li>)}</ol></div></div>
            ) : null}
            <div className="next-step"><span>{confirmation.hasMemoria ? 3 : 2}</span><div><strong>Sigue tu pedido en línea</strong><p>Consulta cada etapa con tu número de pedido y tu correo. También te avisaremos de cada cambio de estatus.</p></div></div>
          </div>

          <div className="hero-actions">
            <Link href={trackingHref} className="button button--primary">Rastrear mi pedido <span aria-hidden="true">→</span></Link>
            <a href={whatsappLink(`Hola HILO MÍO, acabo de realizar el pedido ${confirmation.orderNumber}.`)} target="_blank" rel="noreferrer" className="text-link">Escribir por WhatsApp <span aria-hidden="true">→</span></a>
          </div>
          <Link href="/catalogo" className="confirmation-help">Seguir comprando</Link>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page checkout-page--empty">
        <section className="checkout-empty container">
          <span className="confirmation-flower" aria-hidden="true">✦</span>
          <span className="eyebrow">Tu bolsa está vacía</span>
          <h1>Aún no has agregado <em>ninguna pieza.</em></h1>
          <p>Explora el catálogo o diseña una pieza MEMORIA con tu prenda.</p>
          <div className="hero-actions">
            <Link href="/catalogo" className="button button--primary">Ver joyería</Link>
            <Link href="/memoria/personalizar" className="button button--memoria-outline">Diseñar pieza MEMORIA</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="container checkout-container">
        <div className="checkout-page-heading">
          <Link className="checkout-back-link" href="/catalogo"><span aria-hidden="true">←</span> Seguir comprando</Link>
          <span className="eyebrow">Finalizar compra</span>
          <h1>Casi <em>listo.</em></h1>
          <div className="checkout-steps"><span className="checkout-step checkout-step--active"><b>1</b> Contacto</span><span className="checkout-steps__line" /><span className="checkout-step checkout-step--active"><b>2</b> Entrega</span><span className="checkout-steps__line" /><span className="checkout-step checkout-step--active"><b>3</b> Pago</span><span className="checkout-steps__line" /><span className="checkout-step"><b>4</b> Confirmación</span></div>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {errorMessage ? <div className="checkout-error" role="alert"><span aria-hidden="true">!</span>{errorMessage}</div> : null}

            <section className="checkout-form-section">
              <div className="checkout-section-heading"><span>1</span><div><h2>Datos de contacto</h2><p>Te avisaremos por correo y WhatsApp cada cambio de estatus.</p></div></div>
              <div className="form-grid">
                <label className="form-field form-field--full"><span>Nombre completo <b>*</b></span><input autoComplete="name" required maxLength={180} value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Nombre y apellidos" /></label>
                <label className="form-field"><span>Correo electrónico <b>*</b></span><input autoComplete="email" type="email" required maxLength={254} value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="tu@correo.com" /></label>
                <label className="form-field"><span>Teléfono / WhatsApp <b>*</b></span><input autoComplete="tel" type="tel" required minLength={10} maxLength={40} pattern="[0-9+() -]{10,}" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="10 dígitos" /></label>
              </div>
              <label className="checkout-consent"><input type="checkbox" checked={form.whatsappOptIn} onChange={(event) => updateField("whatsappOptIn", event.target.checked)} /><span>Quiero recibir las notificaciones de mi pedido también por WhatsApp.</span></label>
            </section>

            <section className="checkout-form-section">
              <div className="checkout-section-heading"><span>2</span><div><h2>¿Cómo quieres recibir tu pedido?</h2><p>Los costos se actualizan en el resumen.</p></div></div>
              <div className="option-stack">
                {deliveryMethods.map((method) => {
                  const cost = calculateDeliveryCost(subtotal, method.id);
                  return (
                    <label key={method.id} className={`payment-option${form.deliveryMethod === method.id ? " payment-option--selected" : ""}`}>
                      <input type="radio" name="deliveryMethod" value={method.id} checked={form.deliveryMethod === method.id} onChange={() => updateField("deliveryMethod", method.id)} />
                      <span className="payment-option__copy"><strong>{method.name}</strong><small>{method.description}</small></span>
                      <span className="payment-option__cost">{cost === 0 ? "Gratis" : formatPrice(cost)}</span>
                      <span className="payment-option__check" aria-hidden="true">✓</span>
                    </label>
                  );
                })}
              </div>
              {form.deliveryMethod === "domicilio" ? (
                <div className="form-grid form-grid--spaced">
                  <label className="form-field form-field--full"><span>Calle y número <b>*</b></span><input autoComplete="street-address" required maxLength={240} value={form.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Calle, número exterior e interior" /></label>
                  <label className="form-field"><span>Colonia / referencias</span><input autoComplete="address-line2" maxLength={120} value={form.apartment} onChange={(event) => updateField("apartment", event.target.value)} placeholder="Opcional" /></label>
                  <label className="form-field"><span>Código postal <b>*</b></span><input autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{5}" required minLength={5} maxLength={5} value={form.postalCode} onChange={(event) => updateField("postalCode", event.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="00000" /></label>
                  <label className="form-field"><span>Ciudad o municipio <b>*</b></span><input autoComplete="address-level2" required maxLength={120} value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Tu ciudad" /></label>
                  <label className="form-field"><span>Estado <b>*</b></span><input autoComplete="address-level1" required maxLength={120} value={form.state} onChange={(event) => updateField("state", event.target.value)} placeholder="Tu estado" /></label>
                </div>
              ) : null}
              {form.deliveryMethod === "punto" ? (
                <label className="form-field form-field--spaced"><span>Punto de encuentro <b>*</b></span>
                  <select value={form.pickupPoint} onChange={(event) => updateField("pickupPoint", event.target.value)}>
                    {pickupPoints.map((point) => <option key={point.id} value={point.id}>{point.name} · {point.schedule}</option>)}
                  </select>
                </label>
              ) : null}
              {form.deliveryMethod === "tienda" ? <p className="form-note">Te avisaremos cuando tu pedido esté listo en nuestro establecimiento de Metepec, Estado de México. Horario: lunes a sábado de 10:00 a 19:00 h.</p> : null}
            </section>

            {hasMemoria ? (
              <section className="checkout-form-section checkout-form-section--memoria">
                <div className="checkout-section-heading"><span>✦</span><div><h2>¿Cómo nos haces llegar tu prenda?</h2><p>Aplica a tus piezas MEMORIA. Recibirás instrucciones detalladas al confirmar.</p></div></div>
                <div className="option-stack">
                  {garmentMethods.map((method) => (
                    <label key={method.id} className={`payment-option${form.garmentMethod === method.id ? " payment-option--selected" : ""}`}>
                      <input type="radio" name="garmentMethod" value={method.id} checked={form.garmentMethod === method.id} onChange={() => updateField("garmentMethod", method.id)} />
                      <span className="payment-option__copy"><strong>{method.name}</strong><small>{method.description}</small></span>
                      <span className="payment-option__cost">{method.cost === 0 ? "Incluido" : formatPrice(method.cost)}</span>
                      <span className="payment-option__check" aria-hidden="true">✓</span>
                    </label>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="checkout-form-section">
              <div className="checkout-section-heading"><span>3</span><div><h2>Forma de pago</h2><p>Transacciones protegidas. No almacenamos datos bancarios.</p></div></div>
              <div className="option-stack">
                {availablePayments.map((method) => (
                  <label key={method.id} className={`payment-option${form.paymentMethod === method.id ? " payment-option--selected" : ""}${!method.available ? " payment-option--disabled" : ""}`}>
                    <input type="radio" name="paymentMethod" value={method.id} disabled={!method.available} checked={form.paymentMethod === method.id} onChange={() => updateField("paymentMethod", method.id)} />
                    <span className="payment-option__copy"><strong>{method.name}</strong><small>{method.description}</small></span>
                    <span className="payment-option__cost">{method.available ? "" : "Próximamente"}</span>
                    <span className="payment-option__check" aria-hidden="true">✓</span>
                  </label>
                ))}
              </div>
              <label className="form-field form-field--notes form-field--spaced"><span>Notas para tu pedido <small>Opcional</small></span><textarea rows={3} maxLength={1200} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Indicaciones de entrega, dedicatoria, horario preferido…" /></label>
              <label className="checkout-consent"><input type="checkbox" required /><span>Acepto las <Link href="/ayuda#compras">políticas de compra</Link> y entiendo que las piezas personalizadas y MEMORIA se elaboran por encargo y no admiten devolución salvo defecto de fabricación.</span></label>
            </section>

            <button type="submit" className="button button--primary checkout-submit" disabled={submitting}>
              {submitting ? <><span className="submit-spinner" aria-hidden="true" /> Registrando tu pedido…</> : <>Confirmar pedido <span>{formatPrice(total)}</span></>}
            </button>
            <p className="checkout-secure-note">Tus datos se usan únicamente para preparar, entregar y dar seguimiento a tu pedido.</p>
          </form>

          <aside className="order-summary">
            <div className="order-summary__header"><span>Resumen</span><span>{cart.reduce((count, line) => count + line.quantity, 0)} piezas</span></div>
            <div className="order-summary__items">
              {cart.map((line) => (
                <div className="order-summary-item" key={line.lineId}>
                  <div className="order-summary-item__image"><Image src={line.image} alt={line.name} fill sizes="76px" /><span>{line.quantity}</span></div>
                  <div className="order-summary-item__copy"><strong>{line.name}</strong><small>{line.variant ?? line.summary ?? line.category}</small>{line.engraving ? <p>Grabado: “{line.engraving}”</p> : null}</div>
                  <strong className="order-summary-item__price">{formatPrice(line.unitPrice * line.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="order-summary__totals">
              <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div><span>{deliveryMethods.find((method) => method.id === form.deliveryMethod)?.name}</span><span>{deliveryCost === 0 ? "Gratis" : formatPrice(deliveryCost)}</span></div>
              {hasMemoria ? <div><span>Recepción de prenda</span><span>{garmentCost === 0 ? "Incluida" : formatPrice(garmentCost)}</span></div> : null}
              <div className="order-summary__total"><strong>Total</strong><strong>{formatPrice(total)} <small>MXN</small></strong></div>
            </div>
            {form.deliveryMethod === "domicilio" && subtotal < FREE_SHIPPING_THRESHOLD ? <p className="order-summary__fine-print">Agrega {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} más y el envío a domicilio es gratis.</p> : null}
            <div className="order-summary__made-with"><Image src="/images/estuche-memoria.jpg" alt="Estuche HILO MÍO" fill sizes="360px" /><div><span>Empaque de regalo incluido</span><strong>HILO MÍO</strong></div></div>
            <p className="order-summary__fine-print">¿Dudas antes de pagar? <a href={whatsappLink("Hola HILO MÍO, tengo una duda antes de finalizar mi compra.")} target="_blank" rel="noreferrer">Escríbenos por WhatsApp</a>.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
