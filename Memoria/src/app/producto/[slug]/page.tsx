import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
import { categoryName } from "@/lib/catalog-config";
import { getCatalog, getProductBySlug, getProductReviews } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Pieza no encontrada" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: `${product.name} | HILO MÍO`, description: product.shortDescription, images: product.images[0] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, catalog] = await Promise.all([getProductReviews(product.id), getCatalog()]);
  const related = catalog
    .filter((item) => item.slug !== product.slug)
    .sort((first, second) =>
      Number(second.category === product.category) - Number(first.category === product.category) ||
      Number(second.line === product.line) - Number(first.line === product.line),
    )
    .slice(0, 4);

  return (
    <main className="product-page">
      <div className="product-page__breadcrumb container">
        <Link href="/">Inicio</Link><span aria-hidden="true">/</span>
        <Link href="/catalogo">Joyería</Link><span aria-hidden="true">/</span>
        <Link href={`/catalogo?categoria=${product.category}`}>{categoryName(product.category)}</Link><span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </div>
      <ProductDetail product={product} reviews={reviews} />
      <section className="related-products section container">
        <div className="section-heading section-heading--split">
          <div><span className="eyebrow">También te puede gustar</span><h2>Piezas <em>relacionadas.</em></h2></div>
          <Link href="/catalogo" className="text-link">Ver todo el catálogo <span aria-hidden="true">→</span></Link>
        </div>
        <ProductGrid products={related} mode="featured" />
      </section>
    </main>
  );
}
