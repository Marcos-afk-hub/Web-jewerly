import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { categories } from "@/lib/catalog-config";
import { getCatalog } from "@/lib/catalog";
import { getCollection } from "@/lib/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de joyería",
  description: "Collares, pulseras, aretes, anillos, dijes, cadenas y accesorios personalizados en plata .925, oro laminado y acero. Envíos a todo México.",
};

type CatalogPageProps = {
  searchParams: Promise<{ categoria?: string; q?: string; coleccion?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [{ categoria, q, coleccion }, products] = await Promise.all([searchParams, getCatalog()]);
  const activeCategory = categories.find((category) => category.slug === categoria);
  const activeCollection = getCollection(coleccion ?? "");

  const heading = activeCollection ? (
    <>
      Colección <em>{activeCollection.name}</em>
    </>
  ) : activeCategory ? (
    activeCategory.name
  ) : (
    <>
      Joyería para <em>todos los días.</em>
    </>
  );

  const description = activeCollection
    ? activeCollection.description
    : activeCategory
      ? activeCategory.blurb
      : "Plata .925, oro laminado 14k y acero inoxidable con baño de oro. Piezas para todas las personas, con envío a todo México y entrega local en el Estado de México.";

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span>Joyería</span>
            {activeCollection ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/colecciones/${activeCollection.slug}`}>{activeCollection.name}</Link>
              </>
            ) : null}
            {activeCategory ? (
              <>
                <span aria-hidden="true">/</span>
                <span>{activeCategory.name}</span>
              </>
            ) : null}
          </div>
          <span className={`eyebrow${activeCollection?.memoria ? " eyebrow--memoria" : ""}`}>
            <span className="eyebrow-dot" /> Catálogo HILO MÍO
          </span>
          <h1>{heading}</h1>
          <p>{description}</p>
          <div className="catalog-hero__details">
            <span>{products.length} piezas</span>
            <span aria-hidden="true">·</span>
            <span>Garantía de 30 días</span>
            <span aria-hidden="true">·</span>
            <span>Envío gratis desde $2,500</span>
          </div>
        </div>
      </section>
      <section className="catalog-main container">
        <ProductGrid
          products={products}
          mode="catalog"
          initialCategory={categoria}
          initialQuery={q}
          initialCollection={coleccion}
        />
      </section>
    </main>
  );
}
