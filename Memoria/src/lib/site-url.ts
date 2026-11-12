/**
 * URL pública del sitio.
 *
 * La variable `NEXT_PUBLIC_SITE_URL` la rellena cada persona en el panel de
 * Vercel, y a veces se queda con el texto de ejemplo ("La URL que te asigne
 * Vercel") en vez de una URL real. Si eso llega a `new URL()`, el build
 * revienta con `ERR_INVALID_URL` y el sitio no se publica.
 *
 * Aquí se valida: si el valor no es una URL_absolute válida, se avisa por
 * consola y se usa una URL de reserva. El sitio se publica igual, que es
 * preferible a no publicarlo.
 */

const FALLBACK_SITE_URL = "http://localhost:3000";

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Devuelve la URL pública del sitio, sin la barra final.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) return FALLBACK_SITE_URL;

  if (!isValidAbsoluteUrl(raw)) {
    console.warn(
      `NEXT_PUBLIC_SITE_URL no es una URL válida ("${raw}"). Se usa ${FALLBACK_SITE_URL} en su lugar.`,
    );
    return FALLBACK_SITE_URL;
  }

  return raw.replace(/\/+$/, "");
}
