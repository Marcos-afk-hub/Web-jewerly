"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En producción esto lo captura el servicio de monitoreo; en desarrollo
    // aparece directamente en la consola del navegador.
    console.error(error);
  }, [error]);

  return (
    <main className="not-found-page">
      <section className="container not-found-inner">
        <span className="eyebrow">
          <span className="eyebrow-dot" /> Algo salió mal
        </span>
        <h1>
          No pudimos <em>cargar esta página.</em>
        </h1>
        <p>
          Puede ser un problema momentáneo de la conexión o un detalle técnico de
          nuestro lado. Vuelve a intentarlo o sigue con el catálogo.
        </p>
        {error.digest ? (
          <p className="not-found-digest">
            Código de error: <code>{error.digest}</code>
          </p>
        ) : null}
        <div className="hero-actions not-found-actions">
          <button type="button" className="button button--primary" onClick={reset}>
            Reintentar <span aria-hidden="true">→</span>
          </button>
          <Link href="/" className="text-link">
            Volver al inicio <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
