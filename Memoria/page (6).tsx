import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { whatsappLink } from "@/lib/catalog-config";
import { deliveryMethods, garmentMethods } from "@/lib/fulfillment";
import { getMemoriaProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MEMORIA · Joyería con fragmentos de tus prendas",
  description: "MEMORIA es la línea de HILO MÍO que transforma pequeños fragmentos de prendas y textiles significativos en collares, pulseras, aretes, dijes y sets personalizados.",
};

const memories = [
  { title: "Una prenda de un ser querido", text: "La camisa, el suéter o el rebozo de alguien que quieres tener cerca." },
  { title: "La ropita de un bebé", text: "El primer mameluco o la cobija del hospital, convertidos en una pieza para mamá, papá o los abuelos." },
  { title: "Una graduación", text: "La toga, el uniforme o la playera de la generación de tu hijo o hija." },
  { title: "Un campeonato", text: "La playera del equipo con el que ganaste, con parte del número o del escudo." },
  { title: "Una persona especial", text: "La bufanda que te prestaba, el pañuelo que siempre llevaba." },
  { title: "Un uniforme o una etapa", text: "La bata, el uniforme de trabajo o la playera de un viaje que te cambió." },
];

const differentiators = [
  { title: "Recuerdos que llevas contigo", text: "A diferencia de un peluche o un marco, una joya te acompaña en tu vida cotidiana: al trabajo, a una boda, a un partido." },
  { title: "Aprovechamiento del material", text: "Un fragmento de 3 × 3 cm basta para una pieza; con 8 × 8 cm elaboramos un set completo o varias piezas para distintas personas." },
  { title: "Personalización real", text: "Eliges el tipo de joya, material, tono, cadena, piedra, dije, forma y acabado. Nada es genérico." },
  { title: "Versatilidad", text: "Collar, pulsera y aretes a juego, o varias piezas para cada integrante de la familia a partir de una sola prenda." },
  { title: "Valor emocional", text: "Cada pieza conserva una historia personal e irrepetible y llega con una tarjeta que la cuenta." },
];

const processSteps = [
  { title: "Diseña en línea", text: "Elige tu pieza y sus detalles en el personalizador. Verás el precio y el tiempo estimado antes de pagar." },
  { title: "Elige cómo enviar tu prenda", text: "Guía FedEx prepagada, entrega en un punto de recolección o mensajería local en el Estado de México." },
  { title: "Recibimos y confirmamos", text: "Revisamos el textil, te confirmamos la recepción y acordamos contigo la zona exacta que se conservará." },
  { title: "Elaboración en taller", text: "Cortamos, sellamos y engastamos el fragmento bajo cristal. Te compartimos fotos del avance." },
  { title: "Seguimiento por etapas", text: "Consulta el estatus en línea en cualquier momento: desde el pedido confirmado hasta la entrega." },
  { title: "Entrega", text: "A domicilio con FedEx, en nuestro establecimiento o en un punto de encuentro. El resto de tu prenda regresa contigo." },
];

export default async function MemoriaPage() {
  const memoriaProducts = await getMemoriaProducts();

  return (
    <main className="memoria-page">
      <section className="memoria-hero">
        <div className="container memoria-hero__inner">
          <div className="memoria-hero__copy">
            <span className="eyebrow eyebrow--memoria"><span className="eyebrow-dot" /> Línea MEMORIA · by HILO MÍO</span>
            <h1>Hay recuerdos que merecen<br /><em>acompañarnos siempre.</em></h1>
            <p>MEMORIA transforma un pequeño fragmento de una prenda u objeto textil significativo en joyería y accesorios personalizados: piezas que puedes llevar contigo todos los días, hechas en nuestro taller del Estado de México.</p>
            <div className="hero-actions">
              <Link href="/memoria/personalizar" className="button button--memoria">Diseñar mi pieza <span aria-hidden="true">→</span></Link>
              <a href="#como-funciona" className="text-link">Cómo funciona <span aria-hidden="true">↓</span></a>
            </div>
            <div className="memoria-hero__facts">
              <div><strong>3 × 3 cm</strong><span>es todo lo que necesitamos</span></div>
              <div><strong>5 tipos</strong><span>de pieza para elegir</span></div>
              <div><strong>7 etapas</strong><span>de seguimiento en línea</span></div>
            </div>
          </div>
          <div className="memoria-hero__visual">
            <Image src="/images/hero-memoria.jpg" alt="Dije MEMORIA con bordado y flores secas bajo cristal, sobre lino" fill priority sizes="(max-width: 850px) 100vw, 50vw" />
            <div className="memoria-hero__badge"><span>Un pedacito de su historia.</span><span>Una joya para siempre.</span></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--center">
          <span className="eyebrow eyebrow--memoria">¿Qué recuerdos puedes conservar?</span>
          <h2>Cualquier textil puede convertirse<br /><em>en un recuerdo significativo.</em></h2>
          <p className="section-intro">MEMORIA no es solo para despedidas: también celebra nacimientos, logros, etapas y personas que siguen aquí.</p>
        </div>
        <div className="memory-grid">
          {memories.map((memory, index) => (
            <article className="memory-card" key={memory.title}>
              <span className="memory-card__index">0{index + 1}</span>
              <h3>{memory.title}</h3>
              <p>{memory.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="memoria-diff">
        <div className="container memoria-diff__inner">
          <div className="memoria-diff__image">
            <Image src="/images/detalle-textil.jpg" alt="Detalle de un bordado conservado bajo cristal en una pieza MEMORIA" fill sizes="(max-width: 850px) 100vw, 40vw" />
          </div>
          <div className="memoria-diff__copy">
            <span className="eyebrow eyebrow--memoria">Por qué MEMORIA</span>
            <h2>Diferente a un relicario,<br /><em>diferente a un peluche.</em></h2>
            <ol className="diff-list">
              {differentiators.map((item, index) => (
                <li key={item.title}><span>0{index + 1}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section container" id="como-funciona">
        <div className="section-heading section-heading--center">
          <span className="eyebrow eyebrow--memoria">Cómo funciona</span>
          <h2>De tu prenda a tu joya, <em>en seis pasos.</em></h2>
        </div>
        <div className="process-steps process-steps--six">
          {processSteps.map((step, index) => (
            <article className="process-step" key={step.title}>
              <span className="process-step__number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="garment-section" id="como-enviar">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow eyebrow--memoria">Después de tu compra</span>
              <h2>Cómo nos haces <em>llegar tu prenda.</em></h2>
              <p className="section-intro">Eliges la opción al finalizar tu pedido. En todos los casos recibes instrucciones claras y confirmación de recepción.</p>
            </div>
          </div>
          <div className="garment-grid">
            {garmentMethods.map((method, index) => (
              <article className="garment-card" key={method.id}>
                <span className="garment-card__option">Opción {index + 1}</span>
                <h3>{method.name}</h3>
                <p>{method.description}</p>
                <ol>{method.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                <span className="garment-card__cost">{method.note}</span>
              </article>
            ))}
          </div>
          <div className="material-note">
            <div>
              <span className="eyebrow eyebrow--memoria">¿Qué pasa con tu material?</span>
              <h3>Lo tratamos como lo que es: algo irremplazable.</h3>
            </div>
            <ul>
              <li>Al recibirlo, lo fotografiamos y te confirmamos por WhatsApp o correo.</li>
              <li>Solo cortamos el fragmento necesario; si lo prefieres, tú lo cortas antes de enviarlo.</li>
              <li>Te compartimos la propuesta de encuadre antes de sellar el textil bajo cristal.</li>
              <li>El resto de la prenda se guarda en una bolsa de algodón y regresa contigo junto con tu pieza.</li>
              <li>Nunca utilizamos tu textil para ninguna otra pieza ni fin.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow eyebrow--memoria">Entrega del producto terminado</span>
            <h2>Tu pieza llega <em>como tú prefieras.</em></h2>
          </div>
          <Link href="/ayuda#envios" className="text-link">Políticas de envío <span aria-hidden="true">→</span></Link>
        </div>
        <div className="delivery-grid">
          {deliveryMethods.map((method) => (
            <article className="delivery-card" key={method.id}>
              <h3>{method.name}</h3>
              <p>{method.description}</p>
              <strong>{method.note}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow eyebrow--memoria">Diseños base</span>
              <h2>Empieza desde <em>una de estas piezas.</em></h2>
              <p className="section-intro">Cada diseño se personaliza con tu prenda y tus detalles. Los precios mostrados son el punto de partida.</p>
            </div>
            <Link href="/memoria/personalizar" className="button button--memoria">Abrir personalizador</Link>
          </div>
          <ProductGrid products={memoriaProducts} mode="featured" />
        </div>
      </section>

      <section className="faq-section container">
        <div className="faq-intro">
          <span className="eyebrow eyebrow--memoria">Preguntas frecuentes</span>
          <h2>Lo que más <em>nos preguntan.</em></h2>
          <p>Si tu duda no está aquí, escríbenos. Hablar de recuerdos importantes merece una respuesta personal.</p>
          <a href={whatsappLink("Hola HILO MÍO, tengo una pregunta sobre la línea MEMORIA.")} target="_blank" rel="noreferrer" className="text-link">Escribir por WhatsApp <span aria-hidden="true">→</span></a>
        </div>
        <div className="faq-list">
          <details><summary>¿Tengo que enviar la prenda completa?<span>+</span></summary><p>No. Basta con un fragmento de 3 × 3 cm para una pieza o de 8 × 8 cm para un set. Si prefieres que nosotros elijamos y cortemos la zona, puedes enviar la prenda completa y te la devolvemos junto con tu pedido.</p></details>
          <details><summary>¿La pieza es resistente al agua?<span>+</span></summary><p>El textil va sellado bajo cristal, pero recomendamos retirar la pieza para bañarte, nadar o hacer ejercicio intenso. No prometemos resistencia al agua ni uso permanente: así tu recuerdo dura más.</p></details>
          <details><summary>¿Puedo hacer varias piezas de la misma prenda?<span>+</span></summary><p>Sí. En el personalizador indicas cuántas piezas iguales quieres y, si lo deseas, puedes agregar diseños distintos a tu bolsa. Es la opción favorita de las familias.</p></details>
          <details><summary>¿Cuánto tarda?<span>+</span></summary><p>Entre 10 y 18 días hábiles a partir de que recibimos tu prenda, según la pieza. Puedes seguir cada etapa en línea con tu número de pedido.</p></details>
          <details><summary>¿Qué pasa si mi textil no es apto?<span>+</span></summary><p>Lo revisamos contigo antes de cortar. Si no es viable, te proponemos alternativas o reembolsamos tu pedido íntegro.</p></details>
        </div>
      </section>

      <section className="closing-cta closing-cta--memoria">
        <Image src="/images/atelier-manos.jpg" alt="Artesana colocando un textil en una pieza MEMORIA" fill sizes="100vw" />
        <div className="closing-cta__overlay" />
        <div className="closing-cta__content">
          <span className="eyebrow eyebrow--light">MEMORIA</span>
          <h2>Tu historia,<br /><em>hecha joya.</em></h2>
          <Link href="/memoria/personalizar" className="button button--cream">Diseñar mi pieza <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}
