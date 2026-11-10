"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/components/store-provider";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog-config";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { cart, cartCount, subtotal, hasMemoria, isCartOpen, closeCart, updateQuantity, removeLine } = useStore();
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  useEffect(() => {
    if (!isCartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isCartOpen, closeCart]);

  return (
    <div className={`cart-layer${isCartOpen ? " cart-layer--open" : ""}`} aria-hidden={!isCartOpen}>
      <button className="cart-backdrop" type="button" onClick={closeCart} tabIndex={isCartOpen ? 0 : -1} aria-label="Cerrar bolsa" />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Tu bolsa" aria-hidden={!isCartOpen}>
        <div className="cart-drawer__header">
          <div>
            <span className="eyebrow">HILO MÍO</span>
            <h2>Tu bolsa <span>({cartCount})</span></h2>
          </div>
          <button type="button" className="icon-button" onClick={closeCart} aria-label="Cerrar bolsa">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="cart-shipping-progress">
              <p>{shippingRemaining > 0 ? <>Agrega <strong>{formatPrice(shippingRemaining)}</strong> más y tu envío a domicilio es gratis</> : <>Tu envío a domicilio es gratis <span aria-hidden="true">✦</span></>}</p>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="cart-items">
              {cart.map((line) => (
                <div className={`cart-item${line.kind === "memoria" ? " cart-item--memoria" : ""}`} key={line.lineId}>
                  <Link href={line.kind === "memoria" ? "/memoria/personalizar" : `/producto/${line.slug}`} className="cart-item__image" onClick={closeCart}>
                    <Image src={line.image} alt={line.name} fill sizes="90px" />
                  </Link>
                  <div className="cart-item__details">
                    <div className="cart-item__topline">
                      <div>
                        <span className="cart-item__collection">{line.kind === "memoria" ? "Línea MEMORIA · diseño propio" : line.category}</span>
                        <h3>{line.name}</h3>
                      </div>
                      <button type="button" className="remove-item" onClick={() => removeLine(line.lineId)} aria-label={`Quitar ${line.name}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 11v6m4-6v6M7 7l1 13h8l1-13M9 7V4h6v3" /></svg>
                      </button>
                    </div>
                    {line.variant ? <p className="cart-item__variant">{line.variant}</p> : null}
                    {line.summary ? <p className="cart-item__variant">{line.summary}</p> : null}
                    {line.engraving ? <p className="cart-item__memory">Grabado: “{line.engraving}”</p> : null}
                    <div className="cart-item__bottom">
                      <div className="quantity-stepper" aria-label={`Cantidad de ${line.name}`}>
                        <button type="button" onClick={() => updateQuantity(line.lineId, line.quantity - 1)} aria-label="Disminuir cantidad">−</button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(line.lineId, line.quantity + 1)} aria-label="Aumentar cantidad">+</button>
                      </div>
                      <p className="cart-item__price">{formatPrice(line.unitPrice * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-drawer__bottom">
              {hasMemoria ? <p className="cart-memory-note"><span aria-hidden="true">✦</span> Tu bolsa incluye piezas MEMORIA: en el checkout elegirás cómo hacernos llegar tu prenda.</p> : null}
              <div className="cart-summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div className="cart-summary-row cart-summary-row--muted"><span>Envío y entrega</span><span>Se calcula en el checkout</span></div>
              <Link href="/checkout" onClick={closeCart} className="button button--primary cart-checkout-button">Finalizar compra <span aria-hidden="true">→</span></Link>
              <button type="button" onClick={closeCart} className="continue-shopping">Seguir comprando</button>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <span className="cart-empty__ornament" aria-hidden="true">✦</span>
            <h3>Tu bolsa está vacía</h3>
            <p>Explora el catálogo o diseña una pieza MEMORIA con tu prenda.</p>
            <Link href="/catalogo" onClick={closeCart} className="button button--primary">Ver joyería</Link>
            <Link href="/memoria/personalizar" onClick={closeCart} className="text-link">Diseñar pieza MEMORIA <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </aside>
    </div>
  );
}
