import type { Metadata } from "next";
import Link from "next/link";
import { brand, whatsappLink } from "@/lib/catalog-config";
import { pickupPoints } from "@/lib/fulfillment";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp o correo. Horarios, ubicación en el Estado de México y puntos de entrega de HILO MÍO.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Contacto</span></div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Contacto</span>
          <h1>Hablemos de <em>tu pieza.</em></h1>
          <p>Asesoría de tallas, materiales, grabados, regalos y proyectos MEMORIA. Respondemos en horario de atención, normalmente en menos de una hora.</p>
        </div>
      </section>

      <section className="container contact-layout">
        <div className="contact-cards">
          <a className="contact-card" href={whatsappLink("Hola HILO MÍO, me gustaría recibir asesoría.")} target="_blank" rel="noreferrer">
            <span className="contact-card__label">WhatsApp</span>
            <strong>Atención inmediata</strong>
            <p>Escríbenos para cotizaciones, seguimiento de pedidos o para coordinar la entrega de tu prenda MEMORIA.</p>
            <span className="text-link">Abrir conversación <span aria-hidden="true">→</span></span>
          </a>
          <a className="contact-card" href={`mailto:${brand.email}`}>
            <span className="contact-card__label">Correo</span>
            <strong>{brand.email}</strong>
            <p>Para facturación, pedidos corporativos, prensa y alianzas.</p>
            <span className="text-link">Enviar correo <span aria-hidden="true">→</span></span>
          </a>
          <div className="contact-card">
            <span className="contact-card__label">Establecimiento</span>
            <strong>{brand.location}</strong>
            <p>{brand.hours}. Te compartimos la ubicación exacta al confirmar tu visita o tu entrega en tienda.</p>
            <span className="contact-card__meta">{brand.instagram}</span>
          </div>
        </div>

        <form className="contact-form" action={whatsappLink("Hola HILO MÍO")} method="get" target="_blank">
          <span className="eyebrow">Déjanos un mensaje</span>
          <h2>Te respondemos por WhatsApp</h2>
          <p>Completa el formulario y se abrirá una conversación con tu mensaje listo para enviar.</p>
          <label className="form-field"><span>Nombre</span><input name="nombre" maxLength={120} placeholder="¿Cómo te llamas?" /></label>
          <label className="form-field"><span>Tema</span>
            <select name="tema" defaultValue="Asesoría de compra">
              <option>Asesoría de compra</option>
              <option>Seguimiento de pedido</option>
              <option>Línea MEMORIA</option>
              <option>Cambios y devoluciones</option>
              <option>Pedido corporativo o mayoreo</option>
            </select>
          </label>
          <label className="form-field"><span>Mensaje</span><textarea name="text" rows={4} maxLength={600} placeholder="Cuéntanos qué necesitas" /></label>
          <button type="submit" className="button button--primary">Abrir WhatsApp con mi mensaje</button>
          <small>Al enviar se abrirá WhatsApp con el texto de tu mensaje. No almacenamos esta información.</small>
        </form>
      </section>

      <section className="container contact-points">
        <div className="section-heading section-heading--split">
          <div><span className="eyebrow">Puntos de entrega y recolección</span><h2>Nos vemos en el <em>Estado de México.</em></h2></div>
          <Link href="/ayuda#envios" className="text-link">Políticas de envío <span aria-hidden="true">→</span></Link>
        </div>
        <div className="points-grid">
          {pickupPoints.map((point) => (
            <div className="point-card" key={point.id}><strong>{point.name}</strong><span>{point.schedule}</span><small>Entrega de pedidos y recepción de prendas MEMORIA</small></div>
          ))}
        </div>
      </section>
    </main>
  );
}
