import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand, stockPhoto } from "@/lib/catalog-config";
import { generalObjectives, specificObjectives } from "@/lib/objectives";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "HILO MÍO es una joyería mexicana con taller en el Estado de México. Conoce nuestra historia, nuestros valores y el equipo detrás de cada pieza.",
};

const values = [
  { title: "Calidad que se comprueba", text: "Plata .925 certificada, oro laminado de capa gruesa y acero quirúrgico. Cada pieza pasa control de calidad antes de salir del taller." },
  { title: "Para todas las personas", text: "Diseñamos sin etiquetas de género ni edad. Tallas amplias, estilos diversos y asesoría honesta para elegir." },
  { title: "Cercanía real", text: "Atención por WhatsApp con personas, no con bots. Puntos de entrega en el Estado de México y envíos a todo el país." },
  { title: "Respeto por las historias", text: "Con MEMORIA aprendimos que una prenda puede ser lo más valioso que alguien nos confía. La tratamos así." },
];

const milestones = [
  { year: "Inicio", title: "Un taller y una pulsera de hilo", text: "HILO MÍO nació en el Estado de México con una pulsera de hilo encerado y dije de plata. El nombre quedó: un hilo que une personas." },
  { year: "Crecimiento", title: "Colecciones completas", text: "Sumamos collares, aretes, anillos y cadenas en plata y oro laminado, y el grabado láser para piezas personalizadas." },
  { year: "Consolidación", title: "Envíos a todo México", text: "Convenio con FedEx, puntos de entrega locales, garantía de 30 días y una comunidad de clientes que vuelve." },
  { year: "Hoy", title: "Nace MEMORIA", text: "Lanzamos una línea que convierte fragmentos de prendas significativas en joyería personalizada, con seguimiento por etapas." },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Nosotros</span></div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Quiénes somos</span>
          <h1>Una joyería del Estado de México<br /><em>que cree en las historias.</em></h1>
          <p>Somos un equipo de diseño, taller y atención al cliente que hace joyería y accesorios para la vida real: piezas bien hechas, a precios honestos y con un servicio que se nota.</p>
        </div>
      </section>

      <section className="about-intro container">
        <div className="about-intro__image">
          <Image src={stockPhoto(8681007)} alt="Exhibición de collares y piezas de joyería en la boutique" fill sizes="(max-width: 850px) 100vw, 50vw" />
        </div>
        <div className="about-intro__copy">
          <span className="eyebrow">HILO MÍO</span>
          <h2>Joyas que cuentan historias.</h2>
          <p>Trabajamos con plata .925, oro laminado 14k y acero inoxidable con baño de oro de 18k. Diseñamos colecciones para todos los días —Esenciales, Dorados, Piedra & Luz, Grabados— y sets de regalo listos para entregar.</p>
          <p>Nuestro taller está en {brand.location}. Desde ahí enviamos a toda la República y atendemos entregas locales en puntos de encuentro, porque creemos que comprar joyería debe ser tan cómodo como usarla.</p>
          <div className="about-facts">
            <div><strong>8</strong><span>categorías de joyería</span></div>
            <div><strong>30 días</strong><span>de garantía en acabados</span></div>
            <div><strong>2–5 días</strong><span>de envío con FedEx</span></div>
          </div>
        </div>
      </section>

      <section className="section container" id="historia">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Nuestra historia</span>
          <h2>De una pulsera de hilo <em>a una nueva forma de recordar.</em></h2>
        </div>
        <ol className="timeline">
          {milestones.map((milestone) => (
            <li key={milestone.title}><span className="timeline__year">{milestone.year}</span><div><h3>{milestone.title}</h3><p>{milestone.text}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="values-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><span className="eyebrow">Lo que nos define</span><h2>Cuatro compromisos <em>con quien nos elige.</em></h2></div>
          </div>
          <div className="service-grid">
            {values.map((value, index) => (
              <article className="service-card" key={value.title}><span className="service-card__index">0{index + 1}</span><h3>{value.title}</h3><p>{value.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-memoria container">
        <div className="about-memoria__copy">
          <span className="eyebrow eyebrow--memoria">Por qué creamos MEMORIA</span>
          <h2>Muchas personas guardan prendas <em>que no pueden soltar.</em></h2>
          <p>Lo vimos en nuestros propios clientes: la camisa de un papá, el mameluco de un bebé, la playera de un campeonato. Existían los relicarios y los peluches hechos con ropa, pero faltaba una alternativa que pudiera acompañarte a diario con la calidad de una joya.</p>
          <p>MEMORIA es nuestra respuesta: pequeños fragmentos de tela integrados en collares, pulseras, aretes, dijes y sets, con un proceso transparente de principio a fin.</p>
          <Link href="/memoria" className="button button--memoria">Conocer MEMORIA <span aria-hidden="true">→</span></Link>
        </div>
        <div className="about-memoria__image">
          <Image src="/images/atelier-manos.jpg" alt="Manos del taller HILO MÍO colocando un textil en una pieza MEMORIA" fill sizes="(max-width: 850px) 100vw, 45vw" />
        </div>
      </section>

      <section className="about-objectives" id="objetivos">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">El proyecto</span>
              <h2>Nuestros <em>objetivos.</em></h2>
              <p className="section-intro">
                El proyecto se sostiene sobre {generalObjectives.length} objetivos
                generales y {specificObjectives.length} objetivos específicos, cada
                uno con una entrega concreta detrás.
              </p>
            </div>
            <Link href="/objetivos" className="text-link">
              Ver el proyecto completo <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="objective-cards">
            {generalObjectives.slice(0, 3).map((objective) => (
              <article className="objective-card" key={objective.id}>
                <h3>{objective.title}</h3>
                <p>{objective.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
