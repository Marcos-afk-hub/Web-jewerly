import type { Metadata } from "next";
import Link from "next/link";
import { brand, whatsappLink } from "@/lib/catalog-config";
import { deliveryMethods, garmentMethods, pickupPoints } from "@/lib/fulfillment";

export const metadata: Metadata = {
  title: "Ayuda y políticas",
  description: "Preguntas frecuentes, políticas de compra, envíos, cambios y devoluciones, cuidados de las joyas y proceso de elaboración MEMORIA.",
};

const sections = [
  { id: "preguntas", label: "Preguntas frecuentes" },
  { id: "compras", label: "Políticas de compra" },
  { id: "envios", label: "Políticas de envío" },
  { id: "cambios", label: "Cambios y devoluciones" },
  { id: "cuidados", label: "Cuidados de las joyas" },
  { id: "proceso-memoria", label: "Proceso MEMORIA" },
  { id: "privacidad", label: "Privacidad" },
];

const faqs = [
  { q: "¿Cómo sé mi talla de anillo?", a: "Mide el diámetro interior de un anillo que te quede bien: 15.7 mm = talla 5, 16.5 mm = 6, 17.3 mm = 7, 18.1 mm = 8, 18.9 mm = 9, 19.8 mm = 10, 20.6 mm = 11. Si tienes dudas, escríbenos y te ayudamos antes de confirmar." },
  { q: "¿Las piezas de plata se oscurecen?", a: "La plata .925 puede oxidarse con el tiempo; nuestras piezas llevan baño de rodio para retrasarlo. Con los cuidados básicos y un paño de pulido recuperan su brillo." },
  { q: "¿El baño de oro se desgasta?", a: "El acero con baño de oro 18k y el oro laminado 14k resisten el uso diario. Evita perfumes, cloro y abrasivos para prolongar su vida." },
  { q: "¿Puedo pagar con tarjeta?", a: "Actualmente aceptamos transferencia SPEI y pago en establecimiento. El pago con tarjeta en línea se habilitará próximamente mediante pasarela certificada." },
  { q: "¿Hacen facturas?", a: "Sí. Solicita tu factura por correo con tus datos fiscales dentro del mismo mes de tu compra." },
  { q: "¿Tienen pedidos para empresas o eventos?", a: "Sí, elaboramos piezas grabadas y sets para regalos corporativos, bodas y graduaciones. Escríbenos para cotizar." },
];

export default function HelpPage() {
  return (
    <main className="help-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Ayuda</span></div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Centro de ayuda</span>
          <h1>Todo lo que necesitas saber<br /><em>para comprar con confianza.</em></h1>
          <p>Políticas claras y respuestas directas. Si algo no está aquí, escríbenos por WhatsApp.</p>
        </div>
      </section>

      <div className="container help-layout">
        <nav className="help-nav" aria-label="Secciones de ayuda">
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}
          <a href={whatsappLink("Hola HILO MÍO, tengo una duda.")} target="_blank" rel="noreferrer" className="help-nav__cta">Escribir por WhatsApp →</a>
        </nav>

        <div className="help-content">
          <section id="preguntas" className="help-section">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2>Lo que más nos preguntan</h2>
            <div className="faq-list">
              {faqs.map((faq) => <details key={faq.q}><summary>{faq.q}<span>+</span></summary><p>{faq.a}</p></details>)}
            </div>
          </section>

          <section id="compras" className="help-section">
            <span className="eyebrow">Políticas de compra</span>
            <h2>Cómo funciona tu pedido</h2>
            <ul className="policy-list">
              <li><strong>Confirmación.</strong> Al finalizar tu compra recibes un número de pedido y un correo de confirmación. Las piezas de catálogo se preparan al validar el pago.</li>
              <li><strong>Pagos.</strong> Transferencia SPEI (CLABE enviada por correo y WhatsApp) y pago en establecimiento al recoger. Los precios incluyen IVA y se expresan en pesos mexicanos.</li>
              <li><strong>Piezas por encargo.</strong> Los grabados, tallas especiales y toda la línea MEMORIA se elaboran a partir de tu pedido; el tiempo de elaboración se indica en cada pieza.</li>
              <li><strong>Disponibilidad.</strong> Si una pieza se agota después de tu compra, te avisamos en menos de 24 horas y te ofrecemos alternativa o reembolso total.</li>
              <li><strong>Facturación.</strong> Disponible dentro del mes de compra enviando tus datos fiscales a {brand.email}.</li>
            </ul>
          </section>

          <section id="envios" className="help-section">
            <span className="eyebrow">Políticas de envío</span>
            <h2>Envíos y entregas</h2>
            <div className="policy-grid">
              {deliveryMethods.map((method) => (
                <div className="policy-card" key={method.id}><strong>{method.name}</strong><p>{method.description}</p><span>{method.note}</span></div>
              ))}
            </div>
            <p>Envío a domicilio con FedEx: 2 a 5 días hábiles a partir del despacho, con número de rastreo. El costo es de $180 MXN y es gratuito en compras mayores a $2,500 MXN. Las entregas en puntos de encuentro se realizan en los siguientes horarios:</p>
            <ul className="policy-list policy-list--compact">
              {pickupPoints.map((point) => <li key={point.id}><strong>{point.name}:</strong> {point.schedule}</li>)}
            </ul>
            <p>Si un paquete llega dañado, repórtalo con fotografías dentro de las 48 horas siguientes para gestionar la reposición.</p>
          </section>

          <section id="cambios" className="help-section">
            <span className="eyebrow">Cambios y devoluciones</span>
            <h2>Queremos que tu pieza sea la correcta</h2>
            <ul className="policy-list">
              <li><strong>Cambios de talla o modelo.</strong> Hasta 15 días naturales después de recibir tu pedido, en piezas de catálogo sin uso y con su empaque. El costo del envío de regreso corre por cuenta del cliente, salvo error nuestro.</li>
              <li><strong>Garantía de 30 días.</strong> Cubre defectos de fabricación y acabados (broches, soldaduras, baño). Reparamos o reponemos la pieza sin costo.</li>
              <li><strong>Piezas personalizadas y MEMORIA.</strong> Por tratarse de productos elaborados a tu medida, no admiten cambio ni devolución, excepto por defecto de fabricación. Antes de grabar o sellar un textil te enviamos una vista previa para tu aprobación.</li>
              <li><strong>Reembolsos.</strong> Se procesan a la misma cuenta de pago en un plazo de 5 a 10 días hábiles.</li>
            </ul>
          </section>

          <section id="cuidados" className="help-section">
            <span className="eyebrow">Cuidados de las joyas</span>
            <h2>Para que duren años</h2>
            <ul className="policy-list">
              <li><strong>Guárdalas secas y por separado</strong>, de preferencia en su estuche o bolsa de tela.</li>
              <li><strong>Evita perfumes, cremas, cloro y agua salada.</strong> Colócate la joya al final y retírala para nadar, bañarte o hacer ejercicio.</li>
              <li><strong>Plata .925:</strong> pule con un paño suave; si se oscurece, usa un paño especial para plata.</li>
              <li><strong>Baños de oro y oro laminado:</strong> limpia solo con paño seco; no uses químicos ni cepillos.</li>
              <li><strong>Piezas MEMORIA:</strong> el textil va sellado bajo cristal, pero no son resistentes al agua ni para uso permanente. Retíralas para dormir, bañarte y nadar, y evita golpes sobre el cristal.</li>
            </ul>
          </section>

          <section id="proceso-memoria" className="help-section help-section--memoria">
            <span className="eyebrow eyebrow--memoria">Proceso de elaboración MEMORIA</span>
            <h2>Cómo una prenda se convierte en joya</h2>
            <ol className="policy-steps">
              <li><strong>Recepción y registro.</strong> Fotografiamos tu prenda al llegar, la etiquetamos con tu número de pedido y te confirmamos la recepción.</li>
              <li><strong>Selección del fragmento.</strong> Acordamos contigo la zona a conservar (un bordado, un número, un estampado). Solo cortamos lo necesario: entre 3 × 3 y 8 × 8 cm.</li>
              <li><strong>Estabilizado del textil.</strong> Sellamos los bordes para evitar que se deshilache y lo fijamos sobre una base neutra.</li>
              <li><strong>Engaste bajo cristal.</strong> Colocamos el fragmento en el bisel elegido y lo protegemos con cristal o resina de joyería de alta transparencia.</li>
              <li><strong>Terminado y control de calidad.</strong> Pulimos, montamos cadenas o postes, grabamos si lo pediste y revisamos cada detalle.</li>
              <li><strong>Devolución del material.</strong> El resto de la prenda regresa contigo en una bolsa de algodón, junto con tu pieza y una tarjeta con su historia.</li>
            </ol>
            <p>Cómo hacernos llegar tu prenda: {garmentMethods.map((method) => method.name.toLocaleLowerCase("es-MX")).join(", ")}. <Link href="/memoria#como-enviar">Ver detalles</Link>.</p>
            <p>Hablar de recuerdos puede ser delicado. Si tu prenda perteneció a alguien que ya no está, cuéntanoslo: tratamos cada caso con cuidado, sin prisas y con total respeto.</p>
          </section>

          <section id="privacidad" className="help-section">
            <span className="eyebrow">Privacidad</span>
            <h2>Tus datos, protegidos</h2>
            <p>Usamos tu nombre, correo, teléfono y dirección únicamente para procesar, entregar y dar seguimiento a tus pedidos y para enviarte notificaciones sobre su estatus. No compartimos tu información con terceros fuera de los servicios necesarios para la entrega (paquetería) y la comunicación (correo y WhatsApp). Puedes solicitar la actualización o eliminación de tus datos escribiendo a {brand.email}.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
