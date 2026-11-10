"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { categoryName } from "@/lib/catalog-config";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function memoriaProductIdFromSlug(slug: string) {
  if (slug.includes("set")) return "set";
  if (slug.includes("aretes")) return "aretes";
  if (slug.includes("pulsera")) return "pulsera";
  if (slug.includes("collar")) return "collar";
  return "dije";
}

export function defaultVariant(product: Product) {
  if (product.variants.length === 0) return undefined;
  return product.variants.map((group) => `${group.name}: ${group.options[0]}`).join(" · ");
}

export function ProductCard({ product }: { product: Product }) {
  const { addLine } = useStore();
  const isMemoria = product.line === "memoria";
  const needsPage = Boolean(product.customization);
  const href = isMemoria ? `/memoria/personalizar?producto=${memoriaProductIdFromSlug(product.slug)}` : `/producto/${product.slug}`;

  const quickAdd = () => {
    addLine({
      kind: "producto",
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      unitPrice: product.price,
      quantity: 1,
      category: product.category,
      variant: defaultVariant(product),
    });
  };

  return (
    <article className={`product-card${isMemoria ? " product-card--memoria" : ""}`}>
      <div className="product-card__visual">
        <Link className="product-card__image-link" href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <Image
            className="product-card__image"
            src={product.images[0]}
            alt={`${product.name} · ${product.materials}`}
            fill
            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
        {product.stock === 0 ? <span className="product-card__soldout">Agotado</span> : null}
        {isMemoria || needsPage ? (
          <Link href={href} className="product-card__quick-add" aria-label={isMemoria ? `Diseñar ${product.name}` : `Personalizar ${product.name}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </Link>
        ) : (
          <button type="button" className="product-card__quick-add" onClick={quickAdd} disabled={product.stock === 0} aria-label={`Agregar ${product.name} a la bolsa`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        )}
      </div>
      <div className="product-card__meta">
        <span>{isMemoria ? "Línea MEMORIA" : categoryName(product.category)}</span>
        {product.reviewCount > 0 ? (
          <span className="product-card__rating" aria-label={`${product.rating} de 5 estrellas, ${product.reviewCount} reseñas`}>
            <span aria-hidden="true">★</span> {product.rating.toFixed(1)} <span className="rating-count">({product.reviewCount})</span>
          </span>
        ) : null}
      </div>
      <div className="product-card__title-row">
        <h3><Link href={`/producto/${product.slug}`}>{product.name}</Link></h3>
        <span className="product-card__price">
          {isMemoria ? <small>desde </small> : null}{formatPrice(product.price)}
          {product.compareAtPrice ? <s>{formatPrice(product.compareAtPrice)}</s> : null}
        </span>
      </div>
      <p className="product-card__description">{product.shortDescription}</p>
      <p className="product-card__material">{product.materials}</p>
    </article>
  );
}
