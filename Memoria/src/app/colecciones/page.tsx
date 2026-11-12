import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { collectionNamesInCatalog } from "@/lib/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Colecciones",
  description:
    "Esenciales, Dorados, Piedra & Luz, Grabados, Hilos, Statement y Sets de regalo. Además de MEMORIA, la línea de joyería con fragmentos de prendas significativas.",
};

export default async function CollectionsPage() {
  const catalog = await getCatalog();
  const available = collectionNamesInCatalog(catalog);
  const counts = new Map<string, number>();
  for (const product of catalog) {
    counts.set(product.collectionName, (counts.get(product.collectionName) ?? 0) + 1);
  }

  return (
    <main className="collections-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span>Colecciones</span>
          </div>
          <span className="eyebrow">
            <span className="eyebrow-dot" /> Colecciones
          </span>
          <h1>
            Cada pieza cuenta <em>algo distinto.</em>
          </h1>
          <p>
            La joyería de HILO MÍO se organiza en colecciones pensadas para
            distintas formas de usar: los básicos de siempre, los dorados que
            combinan en capas, las piedras naturales, los grabados con tu texto y
            la línea MEMORIA, que conserva un fragmento de una prenda.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="collection-index">
          {available.map((collection, index) => (
            <Link
              className="collection-index__card"
              href={`/colecciones/${collection.slug}`}
              key={collection.slug}
            >
              <span className="collection-index__image">
                <Image
                  src={collection.image}
                  alt={`Colección ${collection.name}`}
                  fill
                  sizes="(max-width: 700px) 100vw, 40vw"
                />
              </span>
              <span className="collection-index__index">0{index + 1}</span>
              <span className="collection-index__body">
                <strong>{collection.name}</strong>
                <span>{collection.tagline}</span>
                <small>
                  {counts.get(collection.name) ?? 0}{" "}
                  {(counts.get(collection.name) ?? 0) === 1 ? "pieza" : "piezas"}
                </small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
