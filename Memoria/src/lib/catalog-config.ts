export const stockPhoto = (id: number, ext: "jpeg" | "png" = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&w=1200`;

export const categories = [
  { slug: "collares", name: "Collares", blurb: "Para todos los días y para las fechas que importan", image: stockPhoto(29303619, "png") },
  { slug: "pulseras", name: "Pulseras", blurb: "Eslabones, hilos y detalles que acompañan", image: stockPhoto(12155925) },
  { slug: "aretes", name: "Aretes", blurb: "Argollas, huggies y gotas con carácter", image: stockPhoto(38984016) },
  { slug: "anillos", name: "Anillos", blurb: "Sellos, bandas y piezas ajustables", image: stockPhoto(9430429) },
  { slug: "dijes", name: "Dijes", blurb: "Medallas y símbolos para combinar", image: stockPhoto(21235148) },
  { slug: "cadenas", name: "Cadenas", blurb: "Cable, cuerda y figaro en plata y dorado", image: stockPhoto(7679824) },
  { slug: "personalizados", name: "Accesorios personalizados", blurb: "Grabados con nombres, fechas e iniciales", image: stockPhoto(13660667) },
  { slug: "especiales", name: "Colecciones especiales", blurb: "Sets de regalo y la línea MEMORIA", image: "/images/estuche-memoria.jpg" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export function categoryName(slug: string) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export const materialOptions = [
  { id: "plata", name: "Plata .925" },
  { id: "oro-laminado", name: "Oro laminado 14k" },
  { id: "acero-dorado", name: "Acero inoxidable dorado" },
  { id: "acero-plateado", name: "Acero inoxidable plateado" },
  { id: "mixto", name: "Materiales mixtos" },
] as const;

export function materialName(id: string) {
  return materialOptions.find((material) => material.id === id)?.name ?? id;
}

export const styleOptions = [
  { id: "minimalista", name: "Minimalista" },
  { id: "clasico", name: "Clásico" },
  { id: "statement", name: "Statement" },
  { id: "bohemio", name: "Bohemio" },
  { id: "personalizado", name: "Personalizado" },
] as const;

export function styleName(id: string) {
  return styleOptions.find((style) => style.id === id)?.name ?? id;
}

export const brand = {
  name: "HILO MÍO",
  tagline: "Joyas que cuentan historias.",
  claim: "Joyas que cuentan historias. Accesorios que conservan momentos.",
  memoriaClaim: "Hay recuerdos que merecen acompañarnos siempre.",
  location: "Metepec, Estado de México",
  email: "hola@hilomio.mx",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5215500000000",
  hours: "Lunes a sábado · 10:00 a 19:00 h",
  instagram: "@hilomio.mx",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const FREE_SHIPPING_THRESHOLD = 2500;
