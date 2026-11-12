import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { brand, categories, whatsappLink } from "@/lib/catalog-config";
import { collectionNamesInCatalog } from "@/lib/collections";
import { getCatalog, getFeaturedProducts, getRecentReviews } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const serviceCards = [
  { title: "Personalización", text: "Grabado láser incluido en anillos sello, placas y collares de inicial. Te enviamos una vista previa antes de grabar.", link: { href: "/catalogo?categoria=personalizados", label: "Ver piezas grabables" } },
  { title: "Envíos a todo México", text: "Paquetería FedEx con número de rastreo, 2 a 5 días hábiles. Gratis en compras mayores a $2,500 MXN.", link: { href: "/ayuda#envios", label: "Políticas de envío" } },
  { title: "Entrega local", text: "Recoge en nuestro establecimiento de Metepec o en puntos de encuentro del Estado de México sin costo adicional.", link: { href: "/ayuda#envios", label: "Puntos de entrega" } },
  { title: "Garantía y cuidados", text: "30 días de garantía en acabados y asesoría de cuidado para que tus piezas duren años.", link: { href: "/ayuda#cuidados", label: "Cómo cuidar tus joyas" } },
];

export default async function HomePage() {
  const [featured, testimonials, catalog] = await Promise.all([
    getFeaturedProducts(8),
    getRecentReviews(3),
    getCatalog(),
  ]);
  const collections = collectionNamesInCatalog(catalog);

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> Joyería y accesorios · Estado de México</span>
          <h1>Joyas que cuentan historias.<br /><em>Accesorios que conservan momentos.</em></h1>
          <p className="hero-lede">Plata .925, oro laminado y acero de alta calidad en piezas pensadas para todas las personas y todas las edades. Diseñadas y terminadas en nuestro taller del Estado de México.</p>
          <div className="hero-actions">
            <Link href="/catalogo" className="button button--primary">Explorar catálogo <span aria-hidden="true">→</span></Link>
            <Link href="/memoria" className="button button--memoria-outline">Conoce MEMORIA</Link>
          </div>
          <div className="hero-proof">
            <span className="proof-stars" aria-label="5 de 5 estrellas">★★★★★</span>
            <span>Opiniones verificadas de clientes en todo México</span>
          </div>
        </div>
        <div className="hero-visual">
          <Image className="hero-visual__image" src="/images/hero-hilomio.jpg" alt="Selección de joyería HILO MÍO: cadenas de plata y oro, argollas, anillo sello y pulsera sobre piedra" fill priority sizes="(max-width: 850px) 100vw, 55vw" />
          <div className="hero-photo-label"><span>Colección 2026</span><span>Plata · Oro laminado · Acero</span></div>
          <div className="hero-image-caption"><span>Hecho en el Estado de México</span><span>Envíos a todo el país</span></div>
        </div>
      </section>

      <section className="promise-strip" aria-label="Lo que nos distingue">
        <div className="container promise-strip__inner">
          <div><span aria-hidden="true">✦</span><p>Plata .925 y oro laminado <strong>con certificado</strong></p></div>
          <span className="promise-separator" aria-hidden="true" />
          <div><span aria-hidden="true">✦</span><p>Envíos FedEx <strong>a todo México</strong></p></div>
          <span className="promise-separator" aria-hidden="true" />
          <div><span aria-hidden="true">✦</span><p>Garantía de <strong>30 días</strong></p></div>
          <span className="promise-separator" aria-hidden="true" />
          <div><span aria-hidden="true">✦</span><p>Atención personal <strong>por WhatsApp</strong></p></div>
        </div>
      </section>

      <section className="section container" id="categorias">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h2>Encuentra tu <em>próxima pieza.</em></h2>
          </div>
          <Link href="/catalogo" className="text-link">Ver todo el catálogo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link className="category-card" href={`/catalogo?categoria=${category.slug}`} key={category.slug}>
              <Image src={category.image} alt={category.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
              <span className="category-card__index">0{index + 1}</span>
              <span className="category-card__label"><strong>{category.name}</strong><span>{category.blurb}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container" id="colecciones">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow">Colecciones</span>
            <h2>Cada pieza cuenta <em>algo distinto.</em></h2>
            <p className="section-intro">
              Los básicos que siempre usas, los dorados que combinan en capas, las
              piedras naturales y los grabados con tu texto.
            </p>
          </div>
          <Link href="/colecciones" className="text-link">Ver todas las colecciones <span aria-hidden="true">→</span></Link>
        </div>
        <div className="collection-index collection-index--home">
          {collections.map((collection, index) => (
            <Link className="collection-index__card" href={`/colecciones/${collection.slug}`} key={collection.slug}>
              <span className="collection-index__image">
                <Image src={collection.image} alt={`Colección ${collection.name}`} fill sizes="(max-width: 700px) 100vw, 40vw" />
              </span>
              <span className="collection-index__index">0{index + 1}</span>
              <span className="collection-index__body">
                <strong>{collection.name}</strong>
                <span>{collection.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="memoria-feature">
        <div className="container memoria-feature__inner">
          <div className="memoria-feature__image">
            <Image src="/images/hero-memoria.jpg" alt="Dije MEMORIA con un fragmento de tela bordada bajo cristal" fill sizes="(max-width: 850px) 100vw, 50vw" />
            <span className="memoria-feature__tag">Nueva línea</span>
          </div>
          <div className="memoria-feature__copy">
            <span className="eyebrow eyebrow--memoria">MEMORIA by HILO MÍO</span>
            <h2>Hay recuerdos que merecen<br /><em>acompañarnos siempre.</em></h2>
            <p>Transformamos un pequeño fragmento de una prenda significativa —la camisa de alguien querido, la ropita de un bebé, la playera de un campeonato— en joyería que puedes llevar contigo todos los días.</p>
            <ul className="memoria-feature__list">
              <li><strong>Lo llevas contigo.</strong> A diferencia de un recuerdo guardado, una joya te acompaña.</li>
              <li><strong>Rinde para varias piezas.</strong> Un fragmento pequeño alcanza para un set o para toda la familia.</li>
              <li><strong>Tú lo diseñas.</strong> Elige material, cadena, piedra, dije, forma y acabado.</li>
            </ul>
            <div className="hero-actions">
              <Link href="/memoria" className="button button--memoria">Descubrir MEMORIA <span aria-hidden="true">→</span></Link>
              <Link href="/memoria/personalizar" className="text-link">Diseñar mi pieza <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Populares</span>
              <h2>Las piezas <em>más elegidas.</em></h2>
              <p className="section-intro">Favoritos de nuestra comunidad: básicos de plata, dorados que duran y piezas con grabado incluido.</p>
            </div>
            <Link href="/catalogo" className="text-link">Ver todas las piezas <span aria-hidden="true">→</span></Link>
          </div>
          <ProductGrid products={featured} mode="featured" />
        </div>
      </section>

      <section className="section container" id="servicios">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Comprar en HILO MÍO</span>
          <h2>Personalización, envíos <em>y entregas sin complicaciones.</em></h2>
        </div>
        <div className="service-grid">
          {serviceCards.map((card, index) => (
            <article className="service-card" key={card.title}>
              <span className="service-card__index">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <Link href={card.link.href} className="text-link">{card.link.label} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <div className="container reviews-inner">
          <div className="reviews-heading">
            <span className="eyebrow">Opiniones</span>
            <h2>Clientes que <em>vuelven.</em></h2>
            <div className="review-overall"><span>★★★★★</span><strong>4.9</strong><small>Promedio de reseñas verificadas</small></div>
            <Link href="/catalogo" className="text-link text-link--light">Conoce las piezas <span aria-hidden="true">→</span></Link>
          </div>
          <div className="review-cards">
            {testimonials.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card__stars" aria-label={`${review.rating} de 5 estrellas`}>★★★★★</div>
                <h3>“{review.title}”</h3>
                <p>{review.body}</p>
                <div className="review-card__author"><span className="review-avatar">{review.customerName.charAt(0)}</span><span><strong>{review.customerName}</strong><small>{review.location} · {review.productName}</small></span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta">
        <Image src="/images/estuche-memoria.jpg" alt="Estuche HILO MÍO con una pieza lista para regalar" fill sizes="100vw" />
        <div className="closing-cta__overlay" />
        <div className="closing-cta__content">
          <span className="eyebrow eyebrow--light">Estamos para ayudarte</span>
          <h2>¿Buscas un regalo<br /><em>o una pieza especial?</em></h2>
          <p>Escríbenos por WhatsApp y te asesoramos con tallas, materiales, grabados o tu proyecto MEMORIA. {brand.hours}.</p>
          <div className="hero-actions">
            <a href={whatsappLink("Hola HILO MÍO, me gustaría asesoría para elegir una pieza.")} target="_blank" rel="noreferrer" className="button button--cream">Escribir por WhatsApp</a>
            <Link href="/contacto" className="text-link text-link--light">Ver datos de contacto <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
