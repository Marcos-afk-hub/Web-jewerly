import Link from "next/link";
import { brand, categories, whatsappLink } from "@/lib/catalog-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main container">
        <div className="footer-brand-column">
          <Link href="/" className="brand-lockup brand-lockup--footer" aria-label="HILO MÍO, inicio">
            <span className="brand-wordmark">HILO <em>MÍO</em></span>
            <span className="brand-tagline">JOYERÍA · ESTADO DE MÉXICO</span>
          </Link>
          <p>Joyas que cuentan historias.<br /><em>Accesorios que conservan momentos.</em></p>
          <span className="footer-made-in">{brand.location} · {brand.hours}</span>
          <div className="footer-contact-links">
            <a href={whatsappLink("Hola HILO MÍO, me gustaría recibir información.")} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <span>{brand.instagram}</span>
          </div>
        </div>
        <div className="footer-links-column">
          <span className="footer-heading">Joyería</span>
          {categories.map((category) => (
            <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`}>{category.name}</Link>
          ))}
        </div>
        <div className="footer-links-column">
          <span className="footer-heading">MEMORIA</span>
          <Link href="/memoria">Conoce la línea</Link>
          <Link href="/memoria/personalizar">Diseña tu pieza</Link>
          <Link href="/memoria#como-enviar">Cómo enviar tu prenda</Link>
          <Link href="/ayuda#proceso-memoria">Proceso de elaboración</Link>
          <Link href="/rastrear">Seguimiento de pedido</Link>
        </div>
        <div className="footer-links-column">
          <span className="footer-heading">Ayuda</span>
          <Link href="/nosotros">Quiénes somos</Link>
          <Link href="/objetivos">Objetivos del proyecto</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/ayuda#preguntas">Preguntas frecuentes</Link>
          <Link href="/ayuda#compras">Políticas de compra</Link>
          <Link href="/ayuda#envios">Políticas de envío</Link>
          <Link href="/ayuda#cambios">Cambios y devoluciones</Link>
          <Link href="/ayuda#cuidados">Cuidados de las joyas</Link>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 HILO MÍO · Joyería y accesorios · Estado de México</span>
        <span>Pagos con SPEI · Envíos FedEx · Atención por WhatsApp</span>
        <div className="footer-bottom-links"><Link href="/ayuda#compras">Términos</Link><Link href="/ayuda#privacidad">Privacidad</Link><Link href="/admin">Administración</Link></div>
      </div>
    </footer>
  );
}
