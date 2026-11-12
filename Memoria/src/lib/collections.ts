import { stockPhoto } from "@/lib/catalog-config";

/**
 * Colecciones de la casa.
 *
 * Cada producto declara su `collectionName`; esta tabla centraliza la
 * información editorial de cada colección (descripción e imagen) para poder
 * mostrar una página por colección y filtrar el catálogo por ella.
 */
export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** `true` si la colección pertenece a la línea MEMORIA. */
  memoria: boolean;
};

export const collections: Collection[] = [
  {
    slug: "esenciales",
    name: "Esenciales",
    tagline: "Las piezas que siempre vas a usar.",
    description:
      "Básicos de plata .925 con líneas limpias y acabados impecables: argollas lisas, dijes geométricos, cadenas finas y bandas que combinan con todo. Son las piezas que primero eliges y nunca te quitas.",
    image: stockPhoto(29303619, "png"),
    memoria: false,
  },
  {
    slug: "dorados",
    name: "Dorados",
    tagline: "Cálido, resistente y con brillo.",
    description:
      "Acero inoxidable con baño de oro de 18k en pulseras de eslabón, cadenas y medallones. Piezas pensadas para combinarse en capas y para uso diario, sin miedo a que se decoloren.",
    image: stockPhoto(12155925),
    memoria: false,
  },
  {
    slug: "piedra-luz",
    name: "Piedra & Luz",
    tagline: "Piedras naturales de México.",
    description:
      "Cuarzos, ónices y turquesas engastadas en plata .925. Cada piedra tiene variaciones propias de tono y transparencia, por lo que ninguna pieza es exactamente igual a otra.",
    image: stockPhoto(21235148),
    memoria: false,
  },
  {
    slug: "grabados",
    name: "Grabados",
    tagline: "Tu texto, grabado a mano.",
    description:
      "Anillos sello, placas y collares de inicial con grabado láser incluido. Nombres, fechas, coordenadas o una palabra que significa algo: eliges qué quieres llevar escrito.",
    image: stockPhoto(13660667),
    memoria: false,
  },
  {
    slug: "hilos",
    name: "Hilos",
    tagline: "El origen de HILO MÍO.",
    description:
      "Hilo encerado resistente al agua con nudo corredizo y dije de plata .925. La pieza con la que más personas conocen la casa, y la que más veces se regala.",
    image: stockPhoto(37401770),
    memoria: false,
  },
  {
    slug: "statement",
    name: "Statement",
    tagline: "Joyería como declaración.",
    description:
      "Piezas con presencia: anillos envolvente con texturas talladas, argollas martilladas y piezas que se_convertirán en la etiqueta de accesorio.",
    image: stockPhoto(15709721),
    memoria: false,
  },
  {
    slug: "sets-de-regalo",
    name: "Sets de regalo",
    tagline: "Listos para entregar.",
    description:
      "Combinaciones de piezas en estuche, con tarjeta personalizada. La opción cuando quieres regalar algo bonito y seguro, sin adivinar tallas ni materiales.",
    image: stockPhoto(10050219),
    memoria: false,
  },
  {
    slug: "memoria",
    name: "MEMORIA",
    tagline: "Joyería con historia.",
    description:
      "La línea que da nombre al proyecto: collares, pulseras, aretes, dijes y sets que conservan un fragmento de una prenda significativa, sellado bajo cristal.",
    image: "/images/hero-memoria.jpg",
    memoria: true,
  },
];

/** Convierte el `collectionName` de un producto en el slug de su colección. */
export function collectionSlug(name: string) {
  return name
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug) ?? null;
}

/** Colecciones presentes en el catálogo, para no mostrar secciones vacías. */
export function collectionNamesInCatalog(catalog: { collectionName: string }[]) {
  const names = new Set(catalog.map((product) => product.collectionName));
  return collections.filter((collection) => names.has(collection.name));
}
