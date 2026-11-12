import Link from "next/link";
import { categories } from "@/lib/catalog-config";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="container not-found-inner">
        <span className="eyebrow">
          <span className="eyebrow-dot" /> Error 404
        </span>
        <h1>
          Esta pieza <em>no está aquí.</em>
        </h1>
        <p>
          La página que buscas no existe o cambió de lugar. Puede que la pieza
          que querías ya no esté disponible, pero hay muchas más joyerías que sí.
        </p>
        <div className="hero-actions not-found-actions">
          <Link href="/catalogo" className="button button--primary">
            Ver el catálogo <span aria-hidden="true">→</span>
          </Link>
          <Link href="/" className="text-link">
            Volver al inicio <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="not-found-categories">
          <span className="not-found-categories__label">O explora por categoría</span>
          <div className="not-found-categories__links">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
