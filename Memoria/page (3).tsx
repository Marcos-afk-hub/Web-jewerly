import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { categories } from "@/lib/catalog-config";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de joyería",
  description: "Collares, pulseras, aretes, anillos, dijes, cadenas y accesorios personalizados en plata .925, oro laminado y acero. Envíos a todo México.",
};

type CatalogPageProps = {
  searchParams: Promise<{ categoria?: string; q?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [{ categoria, q }, products] = await Promise.all([searchParams, getCatalog()]);
  const activeCategory = categories.find((category) => category.slug === categoria);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Joyería</span>{activeCategory ? <><span aria-hidden="true">/</span><span>{activeCategory.name}</span></> : null}</div>
          <span className="eyebrow"><span className="eyebrow-dot" /> Catálogo HILO MÍO</span>
          <h1>{activeCategory ? activeCategory.name : <>Joyería para <em>todos los días.</em></>}</h1>
          <p>{activeCategory ? activeCategory.blurb : "Plata .925, oro laminado 14k y acero inoxidable con baño de oro. Piezas para todas las personas, con envío a todo México y entrega local en el Estado de México."}</p>
          <div className="catalog-hero__details"><span>{products.length} piezas</span><span aria-hidden="true">·</span><span>Garantía de 30 días</span><span aria-hidden="true">·</span><span>Envío gratis desde $2,500</span></div>
        </div>
      </section>
      <section className="catalog-main container">
        <ProductGrid products={products} mode="catalog" initialCategory={categoria} initialQuery={q} />
      </section>
    </main>
  );
}
