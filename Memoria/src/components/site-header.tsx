"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { categories } from "@/lib/catalog-config";

const navLinks = [
  { href: "/catalogo", label: "Joyería" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/memoria", label: "MEMORIA", accent: true },
  { href: "/memoria/personalizar", label: "Personalizar" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/objetivos", label: "Objetivos" },
  { href: "/ayuda", label: "Ayuda" },
];

export function SiteHeader() {
  const { cartCount, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="announcement-bar">
        <span>Envío gratis a todo México en compras mayores a $2,500</span>
        <span className="announcement-divider" aria-hidden="true">·</span>
        <span>Nueva línea MEMORIA: joyería con fragmentos de tus prendas</span>
        <Link href="/rastrear" className="announcement-link">Rastrear pedido</Link>
      </div>
      {/* `key` en la ruta remonta el encabezado al navegar, lo que cierra el
          menú móvil sin necesidad de un efecto que dispare un render en cascada. */}
      <header className="site-header" key={pathname}>
        <div className="site-header__inner">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span /><span />
          </button>
          <Link href="/" className="brand-lockup" aria-label="HILO MÍO, inicio">
            <span className="brand-wordmark">HILO <em>MÍO</em></span>
            <span className="brand-tagline">JOYERÍA · ESTADO DE MÉXICO</span>
          </Link>
          <nav className={`main-nav${menuOpen ? " main-nav--open" : ""}`} aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.accent ? "main-nav__accent " : ""}${pathname === link.href ? "main-nav__active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="main-nav__categories">
              {categories.map((category) => (
                <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`}>{category.name}</Link>
              ))}
            </div>
          </nav>
          <div className="header-actions">
            <Link href="/rastrear" className="header-icon-link" aria-label="Rastrear pedido">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" /><path d="M3 7.5 12 12l9-4.5M12 12v9" /></svg>
            </Link>
            <Link href="/catalogo" className="header-icon-link" aria-label="Buscar en el catálogo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.2" /><path d="m15.5 15.5 4 4" /></svg>
            </Link>
            <button className="header-cart-button" type="button" onClick={openCart} aria-label={`Abrir bolsa, ${cartCount} artículos`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>
              <span>Bolsa</span>
              <span className="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
        <div className="header-bottom-line" />
      </header>
    </>
  );
}
