"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { memoriaProductIdFromSlug } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { categoryName, materialName, styleName } from "@/lib/catalog-config";
import { formatDate, formatPrice } from "@/lib/format";
import type { Product, Review } from "@/lib/types";

export function ProductDetail({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { addLine } = useStore();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [engraving, setEngraving] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((group) => [group.name, group.options[0]])),
  );
  const [added, setAdded] = useState(false);
  const isMemoria = product.line === "memoria";
  const needsEngraving = Boolean(product.customization) && engraving.trim().length === 0;
  const soldOut = product.stock === 0;

  useEffect(() => {
    if (!zoomOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomOpen]);

  const variantSummary = product.variants.length
    ? product.variants.map((group) => `${group.name}: ${selections[group.name]}`).join(" · ")
    : undefined;

  const handleAdd = () => {
    addLine({
      kind: "producto",
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      unitPrice: product.price + (product.customization && engraving.trim() ? product.customization.extraCost : 0),
      quantity,
      category: product.category,
      variant: variantSummary,
      engraving: engraving.trim() || undefined,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <div className="product-detail-layout container">
        <div className="detail-gallery">
          <button type="button" className="detail-gallery__main" onClick={() => setZoomOpen(true)} aria-label="Ampliar imagen de la pieza">
            <Image key={product.images[activeImage]} src={product.images[activeImage]} alt={`${product.name}, vista ${activeImage + 1}`} fill priority sizes="(max-width: 850px) 100vw, 55vw" />
            <span className="detail-gallery__zoom">Ampliar <span aria-hidden="true">↗</span></span>
            {product.badge ? <span className="product-card__badge detail-gallery__badge">{product.badge}</span> : null}
          </button>
          {product.images.length > 1 ? (
            <div className="detail-gallery__thumbs" aria-label="Galería de producto">
              {product.images.map((image, index) => (
                <button type="button" className={`detail-gallery__thumb${activeImage === index ? " detail-gallery__thumb--active" : ""}`} key={`${image}-${index}`} onClick={() => setActiveImage(index)} aria-label={`Ver imagen ${index + 1}`} aria-pressed={activeImage === index}>
                  <Image src={image} alt="" fill sizes="110px" />
                </button>
              ))}
            </div>
          ) : null}
          <ul className="detail-trust">
            <li><span aria-hidden="true">✦</span> Envío asegurado con FedEx</li>
            <li><span aria-hidden="true">✦</span> Garantía de 30 días en acabados</li>
            <li><span aria-hidden="true">✦</span> Estuche de regalo incluido</li>
          </ul>
        </div>

        <div className="product-detail-copy">
          <div className="product-detail-copy__breadcrumbs"><Link href="/catalogo">Joyería</Link><span aria-hidden="true">/</span><Link href={`/catalogo?categoria=${product.category}`}>{categoryName(product.category)}</Link></div>
          <div className="detail-rating-row">
            {product.reviewCount > 0 ? (
              <>
                <span className="star-string" aria-label={`${product.rating} de 5 estrellas`}>★★★★★</span>
                <a href="#reseñas">{product.rating.toFixed(1)} ({product.reviewCount} reseñas)</a>
              </>
            ) : <span className="detail-rating-row__new">Nuevo en el catálogo</span>}
          </div>
          <span className="eyebrow">{isMemoria ? "Línea MEMORIA" : `${product.collectionName} · ${styleName(product.style)}`}</span>
          <h1>{product.name}</h1>
          <p className="detail-short-description">{product.shortDescription}</p>
          <div className="detail-price-row">
            <strong>{isMemoria ? "Desde " : ""}{formatPrice(product.price)}</strong>
            {product.compareAtPrice ? <s>{formatPrice(product.compareAtPrice)}</s> : null}
            <span>MXN · IVA incluido</span>
          </div>
          <p className="detail-full-description">{product.description}</p>

          {isMemoria ? (
            <div className="memoria-cta-box">
              <span className="memoria-cta-box__label">Se diseña contigo</span>
              <p>Esta pieza se elabora con un fragmento de la prenda que elijas. En el personalizador defines material, tono, forma, piedra y dije, y te indicamos cómo hacernos llegar tu textil.</p>
              <Link href={`/memoria/personalizar?producto=${memoriaProductIdFromSlug(product.slug)}`} className="button button--memoria">Diseñar esta pieza <span aria-hidden="true">→</span></Link>
              <small>Tiempo de elaboración: {product.leadTime}</small>
            </div>
          ) : (
            <>
              {product.variants.map((group) => (
                <div className="variant-group" key={group.name}>
                  <span className="variant-group__label">{group.name}: <strong>{selections[group.name]}</strong></span>
                  <div className="variant-options">
                    {group.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`variant-option${selections[group.name] === option ? " variant-option--active" : ""}`}
                        onClick={() => setSelections((current) => ({ ...current, [group.name]: option }))}
                        aria-pressed={selections[group.name] === option}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {product.customization ? (
                <label className="memory-note-field">
                  <span>{product.customization.label} <small>Hasta {product.customization.maxLength} caracteres</small></span>
                  <input value={engraving} maxLength={product.customization.maxLength} onChange={(event) => setEngraving(event.target.value)} placeholder={product.customization.placeholder} />
                  <small className="memory-note-help">{product.customization.extraCost > 0 ? `Costo adicional: ${formatPrice(product.customization.extraCost)}` : "El grabado está incluido en el precio. Te enviamos una vista previa antes de grabar."}</small>
                </label>
              ) : null}
              <div className="purchase-controls">
                <div className="quantity-stepper quantity-stepper--detail" aria-label="Cantidad">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Disminuir cantidad">−</button>
                  <span aria-live="polite">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))} aria-label="Aumentar cantidad">+</button>
                </div>
                <button type="button" className="button button--primary detail-add-button" onClick={handleAdd} disabled={soldOut || needsEngraving}>
                  {soldOut ? "Agotado" : added ? "Agregado a tu bolsa ✓" : <>Agregar a la bolsa <span>{formatPrice(product.price * quantity)}</span></>}
                </button>
              </div>
              {needsEngraving ? <p className="detail-hint">Escribe el texto a grabar para continuar.</p> : null}
              <div className="detail-purchase-note">
                <span>{product.stock > 0 && product.stock <= 5 ? `Quedan ${product.stock} piezas` : product.leadTime}</span>
                <span aria-hidden="true">·</span>
                <span>Envío gratis desde $2,500</span>
              </div>
            </>
          )}

          <div className="product-specs">
            <details open>
              <summary>Materiales y características <span aria-hidden="true">+</span></summary>
              <p><strong>{product.materials}</strong> · {materialName(product.materialKey)}</p>
              <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </details>
            <details>
              <summary>Envíos y entregas <span aria-hidden="true">+</span></summary>
              <p>Envío a todo México con FedEx (2 a 5 días hábiles), entrega en nuestro establecimiento de Metepec o en puntos de encuentro del Estado de México. Eliges el método al finalizar tu compra.</p>
            </details>
            <details>
              <summary>Cuidados y garantía <span aria-hidden="true">+</span></summary>
              <p>Guarda tu pieza seca y separada de otras joyas. Evita perfumes, cloro y albercas. Cubrimos defectos de fabricación y acabados durante 30 días. Consulta la sección de Ayuda para más detalles.</p>
            </details>
          </div>
        </div>
      </div>

      <section className="product-story container">
        <div className="product-story__copy">
          <span className="eyebrow">Detrás de la pieza</span>
          <h2>{product.name}<em> · {product.collectionName}</em></h2>
          <p>{product.story}</p>
          <div className="product-story__signature"><span>Diseñado por HILO MÍO</span><span className="signature-line" /><span>Estado de México</span></div>
        </div>
        <div className="product-story__image">
          <Image src={isMemoria ? "/images/atelier-manos.jpg" : product.images[product.images.length - 1]} alt={`${product.name} en detalle`} fill sizes="(max-width: 750px) 100vw, 45vw" />
        </div>
      </section>

      <section className="detail-reviews-section" id="reseñas">
        <div className="container detail-reviews-inner">
          <div className="detail-reviews-heading">
            <div><span className="eyebrow">Opiniones verificadas</span><h2>Lo que dicen<br /><em>quienes ya la tienen.</em></h2></div>
            {product.reviewCount > 0 ? (
              <div className="detail-reviews-average"><span className="star-string">★★★★★</span><strong>{product.rating.toFixed(1)}<small> / 5</small></strong><span>{product.reviewCount} reseñas</span></div>
            ) : null}
          </div>
          {reviews.length > 0 ? (
            <div className="detail-review-grid">
              {reviews.map((review) => (
                <article className="detail-review-card" key={review.id}>
                  <span className="review-card__stars" aria-label={`${review.rating} de 5 estrellas`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <h3>{review.title}</h3>
                  <p>{review.body}</p>
                  <div className="detail-review-card__footer"><span className="review-avatar">{review.customerName.charAt(0)}</span><span><strong>{review.customerName}</strong><small>{review.location}</small></span><time dateTime={review.date}>{formatDate(review.date)}</time></div>
                </article>
              ))}
            </div>
          ) : <p className="no-reviews">Esta pieza es nueva: sé la primera persona en compartir tu opinión.</p>}
        </div>
      </section>

      {zoomOpen ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Imagen ampliada de ${product.name}`}>
          <button type="button" className="lightbox__backdrop" onClick={() => setZoomOpen(false)} aria-label="Cerrar imagen ampliada" />
          <div className="lightbox__image"><Image src={product.images[activeImage]} alt={product.name} fill sizes="90vw" /></div>
          <button type="button" className="lightbox__close" onClick={() => setZoomOpen(false)} aria-label="Cerrar imagen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </div>
      ) : null}
    </>
  );
}
