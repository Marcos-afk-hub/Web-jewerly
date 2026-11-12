import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { getCatalog } from "@/lib/catalog";
import { collections, getCollection } from "@/lib/collections";

export const dynamic = "force-dynamic";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Colección no encontrada" };
  return {
    title: `Colección ${collection.name}`,
    description: `${collection.tagline} ${collection.description}`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const catalog = await getCatalog();
  const products = catalog.filter((product) => product.collectionName === collection.name);
  const others = collections.filter((item) => item.slug !== collection.slug && item.memoria === collection.memoria);

  return (
    <main className="collection-page">
      <section className="catalog-hero collection-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/catalogo">Joyería</Link>
            <span aria-hidden="true">/</span>
            <span>{collection.name}</span>
          </div>
          <span className={`eyebrow${collection.memoria ? " eyebrow--memoria" : ""}`}>
            <span className="eyebrow-dot" /> Colección
          </span>
          <h1>
            {collection.name} <em>{collection.tagline}</em>
          </h1>
          <p>{collection.description}</p>
          <div className="catalog-hero__details">
            <span>{products.length} piezas</span>
            <span aria-hidden="true">·</span>
            <span>Garantía de 30 días</span>
            <span aria-hidden="true">·</span>
            <span>Envío gratis desde $2,500</span>
          </div>
        </div>
      </section>

      <section className="collection-feature container">
        <div className="collection-feature__image">
          <Image
            src={collection.image}
            alt={`Colección ${collection.name} de HILO MÍO`}
            fill
            sizes="(max-width: 850px) 100vw, 45vw"
            priority
          />
        </div>
        <div className="collection-feature__copy">
          <span className="eyebrow">HILO MÍO</span>
          <h2>
            {collection.tagline.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{collection.tagline.split(" ").slice(-1).join(" ")}</em>
          </h2>
          <p>{collection.description}</p>
          {collection.memoria ? (
            <div className="hero-actions">
              <Link href="/memoria" className="button button--memoria">
                Conocer la línea <span aria-hidden="true">→</span>
              </Link>
              <Link href="/memoria/personalizar" className="text-link">
                Diseñar mi pieza <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link href="/catalogo" className="button button--primary">
                Ver todo el catálogo <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow">Las piezas</span>
            <h2>
              Todo lo de <em>{collection.name}.</em>
            </h2>
          </div>
          <Link href="/catalogo" className="text-link">
            Ver todo el catálogo <span aria-hidden="true">→</span>
          </Link>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} mode="featured" />
        ) : (
          <p className="empty-results">Esta colección estará disponible muy pronto.</p>
        )}
      </section>

      {others.length > 0 ? (
        <section className="collection-switch">
          <div className="container">
            <span className="eyebrow">Otras colecciones</span>
            <div className="collection-switch__list">
              {others.map((item) => (
                <Link key={item.slug} href={`/colecciones/${item.slug}`}>
                  <span>{item.name}</span>
                  <small>{item.tagline}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
