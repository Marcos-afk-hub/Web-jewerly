import { asc, avg, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import type { ProductCustomization, ProductVariantGroup } from "@/db/schema";
import { stockPhoto } from "@/lib/catalog-config";
import type { Product, Review } from "@/lib/types";

type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  line: "clasica" | "memoria";
  collectionName: string;
  shortDescription: string;
  description: string;
  story: string;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  badge: string | null;
  materials: string;
  materialKey: string;
  style: string;
  features: string[];
  variants: ProductVariantGroup[];
  customization: ProductCustomization | null;
  stock: number;
  leadTime: string;
  featured: boolean;
};

const largo: ProductVariantGroup = { name: "Largo", options: ["40 cm", "45 cm", "50 cm"] };
const tallaPulsera: ProductVariantGroup = { name: "Talla", options: ["S (16 cm)", "M (18 cm)", "L (20 cm)"] };
const tallaAnillo: ProductVariantGroup = { name: "Talla", options: ["5", "6", "7", "8", "9", "10", "11"] };
const tono: ProductVariantGroup = { name: "Tono", options: ["Dorado", "Plateado"] };
const envioInmediato = "Envío en 1–2 días hábiles";
const grabado: ProductCustomization = { label: "Texto a grabar", placeholder: "Ej. 12·03·2019 o una inicial", maxLength: 14, extraCost: 0 };

const productSeeds: ProductSeed[] = [
  {
    slug: "collar-prisma",
    name: "Collar Prisma",
    category: "collares",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "Triángulo geométrico de plata .925 sobre cadena cable fina.",
    description: "Un collar de líneas limpias que funciona igual con una camisa blanca que con una playera. El dije triangular está pulido a mano y la cadena incluye extensión de 5 cm.",
    story: "Prisma abrió nuestra colección Esenciales: piezas sin género ni edad, pensadas para acompañar todos los días sin pedir permiso.",
    images: [stockPhoto(29303619, "png"), stockPhoto(29260960), "/images/hero-hilomio.jpg"],
    price: 1190,
    compareAtPrice: null,
    badge: "Favorito",
    materials: "Plata .925 con baño de rodio antiempañamiento",
    materialKey: "plata",
    style: "minimalista",
    features: ["Dije de 18 mm pulido a mano", "Cadena cable con extensión de 5 cm", "Broche de langosta reforzado", "Incluye estuche HILO MÍO"],
    variants: [largo],
    customization: null,
    stock: 18,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "collar-gema-verde",
    name: "Collar Gema Verde",
    category: "collares",
    line: "clasica",
    collectionName: "Piedra & Luz",
    shortDescription: "Cuarzo verde facetado engastado en plata .925.",
    description: "Una piedra natural de 8 mm con un engaste de garras que deja pasar la luz. Cada cuarzo tiene variaciones propias, por lo que ninguna pieza es exactamente igual a otra.",
    story: "La colección Piedra & Luz nace de combinar piedras naturales mexicanas con monturas discretas que las dejan brillar.",
    images: [stockPhoto(21235148), stockPhoto(29303619, "png")],
    price: 1490,
    compareAtPrice: 1690,
    badge: "Oferta",
    materials: "Plata .925 y cuarzo verde natural",
    materialKey: "plata",
    style: "clasico",
    features: ["Piedra natural de 8 mm", "Engaste de cuatro garras", "Cadena de 45 cm con extensión", "Certificado de autenticidad de plata"],
    variants: [{ name: "Piedra", options: ["Cuarzo verde", "Cuarzo rosa", "Ónix"] }],
    customization: null,
    stock: 9,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "collar-sol",
    name: "Collar Sol",
    category: "collares",
    line: "clasica",
    collectionName: "Dorados",
    shortDescription: "Medalla texturizada en acero con baño de oro 18k.",
    description: "Una medalla cálida con textura de rayos que ilumina cualquier escote. Fabricada en acero inoxidable con baño de oro de 18k, resistente al uso diario.",
    story: "Sol se diseñó para quienes buscan un dorado que acompaña a todas las edades, sin perder brillo con el ritmo cotidiano.",
    images: [stockPhoto(10117804), stockPhoto(11790262)],
    price: 890,
    compareAtPrice: null,
    badge: null,
    materials: "Acero inoxidable con baño de oro 18k",
    materialKey: "acero-dorado",
    style: "clasico",
    features: ["Medalla de 16 mm", "No se oxida ni mancha la piel", "Cadena de 45 cm ajustable", "Hipoalergénico"],
    variants: [largo],
    customization: null,
    stock: 24,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "pulsera-eslabon-dorada",
    name: "Pulsera Eslabón",
    category: "pulseras",
    line: "clasica",
    collectionName: "Dorados",
    shortDescription: "Eslabones tipo clip con baño de oro, para usar sola o en capas.",
    description: "Una pulsera versátil de eslabones alargados que se ve igual de bien en una muñeca con reloj que sola. Cierre de langosta y dos posiciones de ajuste.",
    story: "El eslabón clip es un clásico contemporáneo; lo fabricamos en acero con baño grueso para que acompañe por años.",
    images: [stockPhoto(12155925), stockPhoto(8165653)],
    price: 690,
    compareAtPrice: null,
    badge: "Nuevo",
    materials: "Acero inoxidable con baño de oro 18k",
    materialKey: "acero-dorado",
    style: "clasico",
    features: ["Eslabón de 10 mm", "Dos posiciones de ajuste", "No se decolora", "Apta para uso diario"],
    variants: [tallaPulsera, tono],
    customization: null,
    stock: 20,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "pulsera-hilo-rojo",
    name: "Pulsera Hilo Rojo",
    category: "pulseras",
    line: "clasica",
    collectionName: "Hilos",
    shortDescription: "Hilo encerado ajustable con dije de plata .925.",
    description: "La pulsera que dio nombre a la marca: un hilo encerado resistente al agua con nudo corredizo y un dije de plata a elegir. Un detalle con significado para regalar o regalarte.",
    story: "El hilo rojo representa los lazos que nos unen. Es la pieza con la que más personas conocen HILO MÍO.",
    images: [stockPhoto(37401770), "/images/pulsera-hilo.jpg"],
    price: 450,
    compareAtPrice: null,
    badge: "Clásico de la casa",
    materials: "Hilo encerado y dije de plata .925",
    materialKey: "mixto",
    style: "bohemio",
    features: ["Nudo corredizo ajustable", "Hilo resistente al agua", "Dije de plata de 6 mm", "Ideal para regalar"],
    variants: [{ name: "Color del hilo", options: ["Rojo", "Negro", "Beige", "Verde olivo"] }, { name: "Dije", options: ["Corazón", "Estrella", "Círculo liso"] }],
    customization: null,
    stock: 40,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "pulsera-cadena-fina",
    name: "Pulsera Cadena Fina",
    category: "pulseras",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "Cadena delicada con baño de oro y pequeña barra central.",
    description: "Una pulsera ligera que casi no se siente, con una barra central pulida. Perfecta para combinar con otras piezas de la colección Dorados.",
    story: "Diseñada para quienes prefieren el brillo discreto: una línea de luz en la muñeca.",
    images: [stockPhoto(8165653), stockPhoto(12155925)],
    price: 590,
    compareAtPrice: null,
    badge: null,
    materials: "Acero inoxidable con baño de oro 18k",
    materialKey: "acero-dorado",
    style: "minimalista",
    features: ["Barra central de 20 mm", "Cadena cable de 1.2 mm", "Extensión de 3 cm", "Hipoalergénica"],
    variants: [tallaPulsera],
    customization: null,
    stock: 16,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "argollas-texturizadas",
    name: "Argollas Texturizadas",
    category: "aretes",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "Argollas de plata con textura martillada a mano.",
    description: "Argollas medianas con una textura que captura la luz desde cualquier ángulo. Cierre de bisagra seguro y peso ligero para usarlas todo el día.",
    story: "La textura se trabaja pieza por pieza en nuestro taller, por eso cada par tiene pequeñas variaciones únicas.",
    images: [stockPhoto(38984016), stockPhoto(38999386)],
    price: 790,
    compareAtPrice: null,
    badge: "Favorito",
    materials: "Plata .925",
    materialKey: "plata",
    style: "statement",
    features: ["Diámetro de 25 mm", "Textura martillada a mano", "Cierre de bisagra", "Peso ligero: 3 g por pieza"],
    variants: [{ name: "Diámetro", options: ["18 mm", "25 mm", "35 mm"] }],
    customization: null,
    stock: 14,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "argollas-clasicas",
    name: "Argollas Clásicas",
    category: "aretes",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "El par de argollas lisas que todas las personas deberían tener.",
    description: "Argollas lisas de tubo redondo con acabado pulido espejo. Un básico que funciona a cualquier edad y con cualquier estilo.",
    story: "Las fabricamos en tres tamaños para que elijas entre un acento discreto o una presencia más marcada.",
    images: [stockPhoto(39076774), stockPhoto(38984016)],
    price: 690,
    compareAtPrice: null,
    badge: null,
    materials: "Plata .925",
    materialKey: "plata",
    style: "clasico",
    features: ["Tubo de 2.5 mm", "Acabado pulido espejo", "Cierre de bisagra", "Hipoalergénicas"],
    variants: [{ name: "Diámetro", options: ["15 mm", "20 mm", "30 mm"] }],
    customization: null,
    stock: 22,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "huggies-duo",
    name: "Huggies Duo",
    category: "aretes",
    line: "clasica",
    collectionName: "Dorados",
    shortDescription: "Mini argollas con zirconias, en dorado o plateado.",
    description: "Huggies pequeños que abrazan el lóbulo, con una hilera de zirconias blancas. Se venden por par y combinan perfecto con otras perforaciones.",
    story: "Pensados para usarse en capas: un par en el primer orificio y otro en el segundo.",
    images: [stockPhoto(37304690), stockPhoto(39076774)],
    price: 720,
    compareAtPrice: null,
    badge: "Nuevo",
    materials: "Oro laminado 14k o plata .925 con zirconias",
    materialKey: "oro-laminado",
    style: "minimalista",
    features: ["Diámetro de 10 mm", "Zirconias AAA", "Cierre de clic", "Aptos para segunda perforación"],
    variants: [tono],
    customization: null,
    stock: 30,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "anillo-sello",
    name: "Anillo Sello",
    category: "anillos",
    line: "clasica",
    collectionName: "Grabados",
    shortDescription: "Sello oval de plata con grabado de iniciales incluido.",
    description: "Un anillo sello contemporáneo con superficie oval de 10 × 12 mm lista para grabar una inicial, una fecha o un símbolo. El grabado láser está incluido en el precio.",
    story: "Los anillos sello llevan siglos contando historias de familia; nosotros los hacemos ligeros y para cualquier mano.",
    images: [stockPhoto(2899839), stockPhoto(9430429)],
    price: 1450,
    compareAtPrice: null,
    badge: "Grabado incluido",
    materials: "Plata .925 maciza",
    materialKey: "plata",
    style: "personalizado",
    features: ["Superficie oval de 10 × 12 mm", "Grabado láser incluido", "Interior cómodo redondeado", "Guía de tallas en Ayuda"],
    variants: [tallaAnillo],
    customization: grabado,
    stock: 12,
    leadTime: "Elaboración: 3–5 días hábiles",
    featured: true,
  },
  {
    slug: "anillo-serpiente",
    name: "Anillo Serpiente",
    category: "anillos",
    line: "clasica",
    collectionName: "Statement",
    shortDescription: "Anillo envolvente con textura de escamas en plata.",
    description: "Una pieza con presencia: la serpiente rodea el dedo con escamas talladas y ojos de ónix. Ajuste semiabierto para mayor comodidad.",
    story: "Statement reúne piezas para quienes usan la joyería como declaración de identidad.",
    images: [stockPhoto(15709721), stockPhoto(15709728)],
    price: 1290,
    compareAtPrice: null,
    badge: null,
    materials: "Plata .925 con ónix",
    materialKey: "plata",
    style: "statement",
    features: ["Ajuste semiabierto", "Escamas talladas", "Ojos de ónix natural", "Acabado oxidado en detalles"],
    variants: [{ name: "Talla", options: ["6", "7", "8", "9", "10"] }],
    customization: null,
    stock: 8,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "set-bandas-duo",
    name: "Set Bandas Duo",
    category: "anillos",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "Dos bandas finas de plata para combinar o compartir.",
    description: "Una banda lisa y una martillada de 2 mm, vendidas en par. Úsalas juntas, en dedos distintos o comparte una con alguien especial.",
    story: "Las bandas Duo son el regalo más elegido para parejas, hermanas y mejores amigos.",
    images: [stockPhoto(9430429), stockPhoto(16063791)],
    price: 1090,
    compareAtPrice: 1290,
    badge: "Set",
    materials: "Plata .925",
    materialKey: "plata",
    style: "minimalista",
    features: ["Dos bandas de 2 mm", "Una lisa y una martillada", "Puedes elegir tallas distintas", "Incluye estuche doble"],
    variants: [{ name: "Talla banda lisa", options: ["5", "6", "7", "8", "9", "10"] }, { name: "Talla banda martillada", options: ["5", "6", "7", "8", "9", "10"] }],
    customization: null,
    stock: 15,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "dije-gema",
    name: "Dije Gema",
    category: "dijes",
    line: "clasica",
    collectionName: "Piedra & Luz",
    shortDescription: "Dije con piedra natural, listo para tu cadena favorita.",
    description: "Se vende sin cadena para que lo combines con la que ya tienes o con una de nuestras cadenas. Piedra natural de 6 mm en engaste de plata.",
    story: "Los dijes de Piedra & Luz están pensados para coleccionarse y combinarse.",
    images: [stockPhoto(21235148), stockPhoto(7700270)],
    price: 690,
    compareAtPrice: null,
    badge: null,
    materials: "Plata .925 y piedra natural",
    materialKey: "plata",
    style: "clasico",
    features: ["Piedra de 6 mm", "Argolla compatible con cadenas de hasta 3 mm", "Sin cadena", "Piedras seleccionadas a mano"],
    variants: [{ name: "Piedra", options: ["Cuarzo verde", "Cuarzo rosa", "Ónix", "Turquesa"] }],
    customization: null,
    stock: 25,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "dije-prisma",
    name: "Dije Prisma",
    category: "dijes",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "Triángulo de plata para combinar con cualquier cadena.",
    description: "El dije de nuestro collar más vendido, ahora suelto para que lo uses con la cadena que prefieras.",
    story: "Geometría simple, acabado impecable: un símbolo de equilibrio que acompaña a cualquier persona.",
    images: [stockPhoto(29260960), stockPhoto(29303619, "png")],
    price: 520,
    compareAtPrice: null,
    badge: null,
    materials: "Plata .925 con baño de rodio",
    materialKey: "plata",
    style: "minimalista",
    features: ["18 mm de alto", "Pulido a mano", "Sin cadena", "Unisex"],
    variants: [],
    customization: null,
    stock: 30,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "cadena-cuerda-dorada",
    name: "Cadena Cuerda Dorada",
    category: "cadenas",
    line: "clasica",
    collectionName: "Dorados",
    shortDescription: "Cadena cuerda trenzada con baño de oro, en tres largos.",
    description: "Una cadena con presencia y brillo continuo. Fabricada en acero inoxidable con baño de oro de 18k, no se oxida ni pierde color con el uso.",
    story: "Las cadenas son la base de cualquier colección; por eso las ofrecemos en distintos largos y grosores.",
    images: [stockPhoto(7679824), stockPhoto(12155925)],
    price: 560,
    compareAtPrice: null,
    badge: null,
    materials: "Acero inoxidable con baño de oro 18k",
    materialKey: "acero-dorado",
    style: "clasico",
    features: ["Grosor de 3 mm", "Broche de langosta", "No se decolora", "Unisex"],
    variants: [{ name: "Largo", options: ["45 cm", "50 cm", "60 cm"] }],
    customization: null,
    stock: 35,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "cadena-cable-plata",
    name: "Cadena Cable Plata",
    category: "cadenas",
    line: "clasica",
    collectionName: "Esenciales",
    shortDescription: "La cadena fina de plata .925 ideal para cualquier dije.",
    description: "Cadena cable de 1.5 mm con baño de rodio para retrasar el empañamiento. Compatible con todos nuestros dijes, incluidos los de la línea MEMORIA.",
    story: "Es la cadena que acompaña de serie a nuestros dijes de plata; también la vendemos sola para renovar las tuyas.",
    images: ["/images/hero-hilomio.jpg", stockPhoto(29303619, "png")],
    price: 650,
    compareAtPrice: null,
    badge: null,
    materials: "Plata .925 con baño de rodio",
    materialKey: "plata",
    style: "minimalista",
    features: ["Grosor de 1.5 mm", "Baño de rodio antiempañamiento", "Broche de resorte", "Compatible con dijes MEMORIA"],
    variants: [{ name: "Largo", options: ["40 cm", "45 cm", "50 cm", "60 cm"] }],
    customization: null,
    stock: 40,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "cadena-figaro",
    name: "Cadena Figaro",
    category: "cadenas",
    line: "clasica",
    collectionName: "Dorados",
    shortDescription: "Eslabón figaro clásico, para usar sola o con dije.",
    description: "El patrón figaro alterna eslabones cortos y largos para un ritmo visual atemporal. Acero con baño de oro de 18k, pensada para uso diario.",
    story: "Un clásico que cruza generaciones y estilos.",
    images: [stockPhoto(11790262), stockPhoto(7679824)],
    price: 520,
    compareAtPrice: null,
    badge: null,
    materials: "Acero inoxidable con baño de oro 18k",
    materialKey: "acero-dorado",
    style: "clasico",
    features: ["Grosor de 4 mm", "Broche de langosta", "No se oxida", "Unisex"],
    variants: [{ name: "Largo", options: ["50 cm", "55 cm", "60 cm"] }, tono],
    customization: null,
    stock: 28,
    leadTime: envioInmediato,
    featured: false,
  },
  {
    slug: "collar-inicial",
    name: "Collar Inicial",
    category: "personalizados",
    line: "clasica",
    collectionName: "Grabados",
    shortDescription: "Disco de oro laminado con la inicial que elijas grabada a mano.",
    description: "Un disco de 12 mm con la letra grabada en tipografía serif. Puedes elegir una inicial, un número o un pequeño símbolo.",
    story: "Las iniciales son la forma más sencilla de llevar a alguien cerca: la tuya, la de tus hijos o la de quien quieras.",
    images: [stockPhoto(13660667), stockPhoto(10117804)],
    price: 1190,
    compareAtPrice: null,
    badge: "Personalizable",
    materials: "Oro laminado 14k",
    materialKey: "oro-laminado",
    style: "personalizado",
    features: ["Disco de 12 mm", "Grabado incluido", "Cadena de 45 cm con extensión", "Puedes añadir hasta 3 discos"],
    variants: [{ name: "Número de discos", options: ["1 disco", "2 discos (+$350)", "3 discos (+$700)"] }],
    customization: { label: "Inicial o símbolo a grabar", placeholder: "Ej. M, A, ♥", maxLength: 3, extraCost: 0 },
    stock: 20,
    leadTime: "Elaboración: 3–5 días hábiles",
    featured: true,
  },
  {
    slug: "placa-grabada",
    name: "Placa Grabada",
    category: "personalizados",
    line: "clasica",
    collectionName: "Grabados",
    shortDescription: "Placa de acero con grabado de nombre, fecha o coordenadas.",
    description: "Una placa rectangular de acero cepillado con cadena de 55 cm. El grabado láser puede llevar hasta 14 caracteres por cara. Ideal para regalar a cualquier edad.",
    story: "Nuestra pieza más regalada en el Día del Padre y en graduaciones.",
    images: [stockPhoto(9742272), stockPhoto(7679824)],
    price: 850,
    compareAtPrice: null,
    badge: "Personalizable",
    materials: "Acero inoxidable cepillado",
    materialKey: "acero-plateado",
    style: "personalizado",
    features: ["Placa de 35 × 12 mm", "Grabado láser incluido", "Cadena de 55 cm", "Resistente al uso diario"],
    variants: [tono],
    customization: grabado,
    stock: 25,
    leadTime: "Elaboración: 3–5 días hábiles",
    featured: false,
  },
  {
    slug: "pulsera-placa-grabada",
    name: "Pulsera Placa Grabada",
    category: "personalizados",
    line: "clasica",
    collectionName: "Grabados",
    shortDescription: "Pulsera con placa central grabada, en dorado o plateado.",
    description: "Placa curva de 30 mm sobre cadena ajustable, con el texto que elijas grabado a láser. Una pieza discreta que guarda un mensaje.",
    story: "Muchas familias piden una para cada integrante con la misma fecha grabada.",
    images: [stockPhoto(14509641), stockPhoto(14509640)],
    price: 890,
    compareAtPrice: null,
    badge: null,
    materials: "Acero inoxidable con baño de oro 18k o plateado",
    materialKey: "acero-dorado",
    style: "personalizado",
    features: ["Placa curva de 30 × 6 mm", "Grabado incluido", "Cadena ajustable 16–20 cm", "Hipoalergénica"],
    variants: [tono],
    customization: grabado,
    stock: 18,
    leadTime: "Elaboración: 3–5 días hábiles",
    featured: false,
  },
  {
    slug: "set-esenciales",
    name: "Set Esenciales",
    category: "especiales",
    line: "clasica",
    collectionName: "Sets de regalo",
    shortDescription: "Collar Prisma + Argollas Clásicas en estuche de regalo.",
    description: "La combinación perfecta para empezar una colección o para regalar sin equivocarse. Incluye collar y argollas en plata .925 con estuche doble y tarjeta personalizada.",
    story: "Lo armamos porque era el regalo que más nos pedían: algo bonito, atemporal y listo para entregar.",
    images: [stockPhoto(10050219), stockPhoto(29303619, "png")],
    price: 1690,
    compareAtPrice: 1880,
    badge: "Set de regalo",
    materials: "Plata .925",
    materialKey: "plata",
    style: "clasico",
    features: ["Collar Prisma de 45 cm", "Argollas Clásicas de 20 mm", "Estuche doble", "Tarjeta con mensaje personalizado"],
    variants: [{ name: "Mensaje en tarjeta", options: ["Sin mensaje", "Feliz cumpleaños", "Gracias por todo", "Te quiero"] }],
    customization: null,
    stock: 10,
    leadTime: envioInmediato,
    featured: true,
  },
  {
    slug: "memoria-dije-lumbre",
    name: "MEMORIA · Dije Lumbre",
    category: "especiales",
    line: "memoria",
    collectionName: "MEMORIA",
    shortDescription: "Dije oval con un fragmento de tu prenda bajo cristal.",
    description: "El diseño base de la línea MEMORIA: un dije oval con bisel de metal que conserva un fragmento textil protegido bajo cristal. Se diseña contigo en el personalizador.",
    story: "Lumbre habla de la luz que se queda: la de una persona, una etapa o un logro que quieres llevar cerca.",
    images: ["/images/dije-lumbre.jpg", "/images/detalle-textil.jpg", "/images/atelier-manos.jpg"],
    price: 1290,
    compareAtPrice: null,
    badge: "Línea MEMORIA",
    materials: "Acero, plata .925 u oro laminado, cristal y tu textil",
    materialKey: "mixto",
    style: "personalizado",
    features: ["Fragmento textil de 3 × 3 cm", "Cristal protector", "Elige forma, tono y acabado", "Se diseña en el personalizador"],
    variants: [],
    customization: null,
    stock: 99,
    leadTime: "10–12 días hábiles tras recibir tu prenda",
    featured: true,
  },
  {
    slug: "memoria-collar-abrazo",
    name: "MEMORIA · Collar Abrazo",
    category: "especiales",
    line: "memoria",
    collectionName: "MEMORIA",
    shortDescription: "Medallón redondo con tu textil y cadena a elegir.",
    description: "Un medallón discreto que guarda un recorte de la prenda que elijas: la camisa de alguien, la ropita de un bebé, la playera de un campeonato.",
    story: "Abrazo es la pieza MEMORIA más elegida para regalar entre varios integrantes de una familia.",
    images: ["/images/collar-abrazo.jpg", "/images/detalle-textil.jpg", "/images/estuche-memoria.jpg"],
    price: 1890,
    compareAtPrice: null,
    badge: "Línea MEMORIA",
    materials: "Acero, plata .925 u oro laminado, cristal y tu textil",
    materialKey: "mixto",
    style: "personalizado",
    features: ["Medallón de 18 mm", "Cadena a elegir", "Varias piezas de una misma prenda", "Se diseña en el personalizador"],
    variants: [],
    customization: null,
    stock: 99,
    leadTime: "12–15 días hábiles tras recibir tu prenda",
    featured: false,
  },
  {
    slug: "memoria-aretes-rosal",
    name: "MEMORIA · Aretes Rosal",
    category: "especiales",
    line: "memoria",
    collectionName: "MEMORIA",
    shortDescription: "Par de aretes con dos pequeños fragmentos de tu textil.",
    description: "Dos pequeños marcos que conservan destellos del tejido que elijas. Ligeros, hipoalergénicos y pensados para usarse a diario.",
    story: "Inspirados en los detalles que encontramos en la ropa que amamos: un botón, un bordado, una flor diminuta.",
    images: ["/images/aretes-rosal.jpg", "/images/detalle-textil.jpg", "/images/atelier-manos.jpg"],
    price: 1390,
    compareAtPrice: null,
    badge: "Línea MEMORIA",
    materials: "Acero, plata .925 u oro laminado, cristal y tu textil",
    materialKey: "mixto",
    style: "personalizado",
    features: ["Marcos de 10 mm", "Postes hipoalergénicos", "Dos fragmentos de 2 × 2 cm", "Se diseña en el personalizador"],
    variants: [],
    customization: null,
    stock: 99,
    leadTime: "10–12 días hábiles tras recibir tu prenda",
    featured: false,
  },
  {
    slug: "memoria-pulsera-lazo",
    name: "MEMORIA · Pulsera Lazo",
    category: "especiales",
    line: "memoria",
    collectionName: "MEMORIA",
    shortDescription: "Pulsera con dije oval que guarda un fragmento de tu prenda.",
    description: "Una pulsera delicada con cadena ajustable y un dije que conserva el textil que elijas. Un recuerdo íntimo que acompaña la muñeca todos los días.",
    story: "Lazo está inspirada en los vínculos que no se ven, pero siempre están.",
    images: ["/images/pulsera-hilo.jpg", "/images/detalle-textil.jpg", "/images/estuche-memoria.jpg"],
    price: 1690,
    compareAtPrice: null,
    badge: "Línea MEMORIA",
    materials: "Acero, plata .925 u oro laminado, cristal y tu textil",
    materialKey: "mixto",
    style: "personalizado",
    features: ["Dije oval de 12 mm", "Cadena ajustable", "Fragmento de 3 × 3 cm", "Se diseña en el personalizador"],
    variants: [],
    customization: null,
    stock: 99,
    leadTime: "12–15 días hábiles tras recibir tu prenda",
    featured: false,
  },
  {
    slug: "memoria-set-familia",
    name: "MEMORIA · Set Familia",
    category: "especiales",
    line: "memoria",
    collectionName: "MEMORIA",
    shortDescription: "Collar, pulsera y aretes con el mismo textil, en estuche.",
    description: "Con un solo fragmento de 8 × 8 cm elaboramos un set completo o varias piezas para distintos integrantes de la familia. Incluye estuche y tarjeta con la historia de la prenda.",
    story: "Nació cuando una familia nos pidió que la camisa de su papá alcanzara para los cinco hermanos.",
    images: ["/images/estuche-memoria.jpg", "/images/collar-abrazo.jpg", "/images/aretes-rosal.jpg"],
    price: 4290,
    compareAtPrice: 4970,
    badge: "Línea MEMORIA",
    materials: "Acero, plata .925 u oro laminado, cristal y tu textil",
    materialKey: "mixto",
    style: "personalizado",
    features: ["Tres piezas a juego", "Un solo fragmento textil", "Estuche familiar", "Se diseña en el personalizador"],
    variants: [],
    customization: null,
    stock: 99,
    leadTime: "15–18 días hábiles tras recibir tu prenda",
    featured: true,
  },
];

const reviewSeeds = [
  { slug: "collar-prisma", customerName: "Daniel R.", location: "Toluca", rating: 5, title: "Lo uso todos los días", body: "Buscaba algo sencillo que no se viera femenino ni masculino. El acabado es impecable y la cadena no se ha empañado.", date: "2025-02-10" },
  { slug: "collar-prisma", customerName: "Mariana G.", location: "Metepec", rating: 5, title: "Regalo perfecto", body: "Se lo regalé a mi hijo por su graduación y no se lo quita. El estuche es muy bonito.", date: "2025-01-22" },
  { slug: "collar-gema-verde", customerName: "Paola V.", location: "Ciudad de México", rating: 5, title: "La piedra es preciosa", body: "El cuarzo tiene un verde profundo y el engaste es fino. Llegó en dos días con FedEx.", date: "2025-02-03" },
  { slug: "collar-sol", customerName: "Rosa María L.", location: "Lerma", rating: 5, title: "Dorado que sí dura", body: "Tengo seis meses usándolo y sigue como nuevo. Para mi edad buscaba algo discreto y elegante.", date: "2025-01-30" },
  { slug: "pulsera-eslabon-dorada", customerName: "Fernanda C.", location: "Querétaro", rating: 5, title: "Se ve de mucho más precio", body: "La uso con reloj y combina perfecto. El cierre es firme.", date: "2025-02-12" },
  { slug: "pulsera-eslabon-dorada", customerName: "Luis A.", location: "Naucalpan", rating: 4, title: "Buen material", body: "Muy buena calidad; me hubiera gustado una talla intermedia, pero el ajuste funciona.", date: "2025-01-18" },
  { slug: "pulsera-hilo-rojo", customerName: "Sofía M.", location: "Toluca", rating: 5, title: "Compré cuatro para mi familia", body: "Cada quien con un dije diferente. El hilo aguanta el agua y el dije es de plata de verdad.", date: "2025-02-08" },
  { slug: "pulsera-hilo-rojo", customerName: "Jorge E.", location: "Zinacantepec", rating: 5, title: "Sencilla y con significado", body: "La traigo desde hace un año y sigue intacta. Excelente atención por WhatsApp.", date: "2024-12-15" },
  { slug: "pulsera-cadena-fina", customerName: "Andrea T.", location: "Monterrey", rating: 5, title: "Delicada y resistente", body: "No se me ha roto ni decolorado. La barrita le da un toque moderno.", date: "2025-02-01" },
  { slug: "argollas-texturizadas", customerName: "Valeria D.", location: "Puebla", rating: 5, title: "Brillan con cualquier luz", body: "La textura es hermosa y son muy ligeras. Mis favoritas para el trabajo.", date: "2025-02-11" },
  { slug: "argollas-texturizadas", customerName: "Camila H.", location: "Metepec", rating: 5, title: "Calidad de joyería", body: "Se nota la mano del taller; cada argolla es un poquito distinta y eso me encanta.", date: "2025-01-12" },
  { slug: "argollas-clasicas", customerName: "Isabel B.", location: "Ciudad de México", rating: 5, title: "El básico que faltaba", body: "Tamaño mediano perfecto. El cierre es seguro y no pesan.", date: "2025-02-05" },
  { slug: "huggies-duo", customerName: "Regina P.", location: "Guadalajara", rating: 5, title: "Perfectos para segunda perforación", body: "Compré el par dorado y luego el plateado. Las zirconias brillan muchísimo.", date: "2025-02-13" },
  { slug: "anillo-sello", customerName: "Emilio S.", location: "Toluca", rating: 5, title: "El grabado quedó finísimo", body: "Pedí las iniciales de mi abuelo. Me mandaron una foto antes de enviarlo. Excelente servicio.", date: "2025-02-06" },
  { slug: "anillo-sello", customerName: "Carolina A.", location: "Morelia", rating: 5, title: "Mi regalo de aniversario", body: "Es macizo, cómodo y el grabado se lee perfecto. La guía de tallas me ayudó a atinarle.", date: "2025-01-25" },
  { slug: "anillo-serpiente", customerName: "Ximena O.", location: "Ciudad de México", rating: 5, title: "Una pieza con carácter", body: "Las escamas están muy bien detalladas y el ajuste semiabierto es cómodo.", date: "2025-01-28" },
  { slug: "set-bandas-duo", customerName: "Natalia H.", location: "Toluca", rating: 5, title: "Una para mí y una para mi hermana", body: "Pedimos tallas diferentes sin problema. Llegaron en estuche doble, muy bonito.", date: "2025-02-02" },
  { slug: "dije-gema", customerName: "Marisol F.", location: "Aguascalientes", rating: 5, title: "Combina con todo", body: "Lo pongo en mi cadena de plata y se ve elegante. Compré la turquesa.", date: "2025-01-20" },
  { slug: "dije-prisma", customerName: "Rodrigo M.", location: "Metepec", rating: 4, title: "Muy buen acabado", body: "Lo compré para mi cadena figaro y queda perfecto. Buen precio.", date: "2025-02-09" },
  { slug: "cadena-cuerda-dorada", customerName: "Alejandro N.", location: "Toluca", rating: 5, title: "No se ha opacado", body: "La uso diario, incluso en el gimnasio, y sigue dorada. Buen grosor.", date: "2025-01-16" },
  { slug: "cadena-cable-plata", customerName: "Elena P.", location: "Tijuana", rating: 5, title: "Perfecta para mi dije MEMORIA", body: "La compré para el dije de la camisa de mi papá. Es delicada pero firme.", date: "2025-02-04" },
  { slug: "cadena-figaro", customerName: "Héctor J.", location: "Lerma", rating: 5, title: "Clásica y resistente", body: "Para hombre queda muy bien en 60 cm. El broche es sólido.", date: "2025-01-14" },
  { slug: "collar-inicial", customerName: "Lucía M.", location: "Guadalajara", rating: 5, title: "Con las iniciales de mis hijos", body: "Pedí tres discos y el grabado es muy fino. Llegó antes de lo prometido.", date: "2025-02-07" },
  { slug: "placa-grabada", customerName: "Gabriel T.", location: "Naucalpan", rating: 5, title: "Regalo del Día del Padre", body: "Grabamos la fecha de nacimiento de mi hija. Mi papá no se la quita.", date: "2025-01-19" },
  { slug: "pulsera-placa-grabada", customerName: "Diana R.", location: "Toluca", rating: 5, title: "Discreta y con mensaje", body: "Grabé una palabra que significa mucho para mí. El acabado dorado es muy bonito.", date: "2025-02-14" },
  { slug: "set-esenciales", customerName: "Patricia G.", location: "Ciudad de México", rating: 5, title: "Regalo sin errores", body: "Lo pedí para mi mamá con tarjeta personalizada. Todo llegó impecable y a tiempo.", date: "2025-01-27" },
  { slug: "memoria-dije-lumbre", customerName: "Mariana R.", location: "Ciudad de México", rating: 5, title: "Volví a tenerla cerquita", body: "Les mandé un pedacito de la blusa favorita de mi mamá y recibí algo más bonito de lo que imaginaba. Me compartieron fotos del proceso.", date: "2025-02-14" },
  { slug: "memoria-dije-lumbre", customerName: "Tomás V.", location: "Metepec", rating: 5, title: "La playera del campeonato", body: "Guardamos un pedazo del número de mi hijo en un dije. Fue el mejor regalo de su cumpleaños.", date: "2025-01-29" },
  { slug: "memoria-collar-abrazo", customerName: "Fernanda C.", location: "Puebla", rating: 5, title: "Una experiencia muy cálida", body: "Tenía nervios de enviar la camisa de mi papá, pero me acompañaron con paciencia y me devolvieron el resto de la prenda.", date: "2025-01-18" },
  { slug: "memoria-aretes-rosal", customerName: "Jimena L.", location: "Oaxaca", rating: 5, title: "Mi vestido de novia, siempre conmigo", body: "Son ligeritos y el encaje se ve increíble bajo el cristal.", date: "2025-02-09" },
  { slug: "memoria-pulsera-lazo", customerName: "Valeria D.", location: "San Luis Potosí", rating: 5, title: "La ropita de mi bebé", body: "Con el mameluco de mi hija hicieron una pulsera para mí y otra para la abuela. Un detalle precioso.", date: "2025-01-30" },
  { slug: "memoria-set-familia", customerName: "Gabriela N.", location: "Veracruz", rating: 5, title: "Alcanzó para los cinco hermanos", body: "Con un solo pedazo de la camisa de mi papá nos hicieron un dije a cada quien. La entrega en punto fue muy puntual.", date: "2025-01-16" },
];

let seedPromise: Promise<void> | undefined;

export async function ensureCatalogSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await db.insert(products).values(productSeeds).onConflictDoNothing();
      const existing = await db.select({ id: products.id, slug: products.slug }).from(products);
      const idBySlug = new Map(existing.map((product) => [product.slug, product.id]));
      const seededReviews = reviewSeeds.flatMap((review) => {
        const productId = idBySlug.get(review.slug);
        if (!productId) return [];
        return [{
          productId,
          customerName: review.customerName,
          location: review.location,
          rating: review.rating,
          title: review.title,
          body: review.body,
          createdAt: new Date(`${review.date}T12:00:00.000Z`),
        }];
      });
      if (seededReviews.length) {
        await db.insert(reviews).values(seededReviews).onConflictDoNothing();
      }
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }
  await seedPromise;
}

/**
 * Catálogo de respaldo, construido en memoria a partir de las semillas.
 *
 * Las bases de datos gestionadas en plan gratuito se suspenden tras unos
 * minutos de inactividad y tardan un momento en volver a despertar. Si eso
 * pasara justo cuando alguien visita el catálogo, la página no debe
 * devolver un error 500: se sirve el catálogo desde la semilla y el sitio
 * sigue siendo utilizable.
 *
 * Es también el respaldo que evita que un fallo de red tumbe la tienda.
 */
function buildFallbackCatalog(): Product[] {
  const summaryBySlug = new Map<string, { rating: number; reviewCount: number }>();
  for (const review of reviewSeeds) {
    const current = summaryBySlug.get(review.slug);
    const count = (current?.reviewCount ?? 0) + 1;
    const total = (current?.rating ?? 0) * (current?.reviewCount ?? 0) + review.rating;
    summaryBySlug.set(review.slug, { rating: total / count, reviewCount: count });
  }

  return productSeeds.map((seed, index) => {
    const summary = summaryBySlug.get(seed.slug);
    return {
      id: index + 1,
      slug: seed.slug,
      name: seed.name,
      category: seed.category,
      line: seed.line,
      collectionName: seed.collectionName,
      shortDescription: seed.shortDescription,
      description: seed.description,
      story: seed.story,
      images: seed.images,
      price: seed.price,
      compareAtPrice: seed.compareAtPrice,
      badge: seed.badge,
      materials: seed.materials,
      materialKey: seed.materialKey,
      style: seed.style,
      features: seed.features,
      variants: seed.variants,
      customization: seed.customization,
      stock: seed.stock,
      leadTime: seed.leadTime,
      featured: seed.featured,
      rating: summary ? Number(summary.rating.toFixed(1)) : 0,
      reviewCount: summary?.reviewCount ?? 0,
    };
  });
}

type Summary = { productId: number; rating: string | null; reviewCount: number };

function mapProducts(rows: (typeof products.$inferSelect)[], summaries: Summary[]): Product[] {
  const summaryById = new Map(summaries.map((summary) => [summary.productId, summary]));
  return rows.map((row) => {
    const summary = summaryById.get(row.id);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      line: row.line === "memoria" ? "memoria" : "clasica",
      collectionName: row.collectionName,
      shortDescription: row.shortDescription,
      description: row.description,
      story: row.story,
      images: row.images,
      price: row.price,
      compareAtPrice: row.compareAtPrice,
      badge: row.badge,
      materials: row.materials,
      materialKey: row.materialKey,
      style: row.style,
      features: row.features,
      variants: row.variants ?? [],
      customization: row.customization ?? null,
      stock: row.stock,
      leadTime: row.leadTime,
      featured: row.featured,
      rating: summary?.rating ? Number(Number(summary.rating).toFixed(1)) : 0,
      reviewCount: Number(summary?.reviewCount ?? 0),
    };
  });
}

async function getReviewSummaries(): Promise<Summary[]> {
  return db
    .select({ productId: reviews.productId, rating: avg(reviews.rating), reviewCount: count(reviews.id) })
    .from(reviews)
    .groupBy(reviews.productId);
}

export async function getCatalog() {
  try {
    await ensureCatalogSeeded();
    const [rows, summaries] = await Promise.all([
      db.select().from(products).orderBy(asc(products.id)),
      getReviewSummaries(),
    ]);
    return mapProducts(rows, summaries);
  } catch (error) {
    // La base no respondió (se acaba de suspender, o hay un problema de
    // red). Se sirve el catálogo desde la semilla para que la página siga
    // disponible en lugar de devolver un error.
    console.error("No se pudo leer el catálogo de la base de datos:", error);
    return buildFallbackCatalog();
  }
}

export async function getFeaturedProducts(limit = 8) {
  const catalog = await getCatalog();
  return catalog.filter((product) => product.featured).slice(0, limit);
}

export async function getMemoriaProducts() {
  const catalog = await getCatalog();
  return catalog.filter((product) => product.line === "memoria");
}

export async function getProductBySlug(slug: string) {
  try {
    await ensureCatalogSeeded();
    const [rows, summaries] = await Promise.all([
      db.select().from(products).where(eq(products.slug, slug)).limit(1),
      getReviewSummaries(),
    ]);
    if (!rows[0]) return null;
    return mapProducts(rows, summaries)[0] ?? null;
  } catch (error) {
    console.error("No se pudo leer el producto de la base de datos:", error);
    return buildFallbackCatalog().find((product) => product.slug === slug) ?? null;
  }
}

export async function getProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  await ensureCatalogSeeded();
  return db.select().from(products).where(inArray(products.slug, slugs));
}

function mapReview(review: typeof reviews.$inferSelect): Review {
  return {
    id: review.id,
    customerName: review.customerName,
    location: review.location,
    rating: review.rating,
    title: review.title,
    body: review.body,
    date: review.createdAt.toISOString(),
  };
}

export async function getProductReviews(productId: number): Promise<Review[]> {
  try {
    await ensureCatalogSeeded();
    const rows = await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
    return rows.map(mapReview);
  } catch (error) {
    console.error("No se pudieron leer las reseñas del producto:", error);
    return buildFallbackReviews(100).filter((review) => review.productSlug === productSeeds[productId - 1]?.slug);
  }
}

export async function getRecentReviews(limit = 3): Promise<(Review & { productName: string; productSlug: string })[]> {
  try {
    await ensureCatalogSeeded();
    const rows = await db
      .select({ review: reviews, productName: products.name, productSlug: products.slug })
      .from(reviews)
      .innerJoin(products, eq(products.id, reviews.productId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    return rows.map((row) => ({ ...mapReview(row.review), productName: row.productName, productSlug: row.productSlug }));
  } catch (error) {
    console.error("No se pudieron leer las reseñas recientes:", error);
    return buildFallbackReviews(limit);
  }
}

/** Reseñas construidas en memoria a partir de las semillas. */
function buildFallbackReviews(limit = 3): (Review & { productName: string; productSlug: string })[] {
  const nameBySlug = new Map(productSeeds.map((product) => [product.slug, product.name]));
  return [...reviewSeeds]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((review, index) => ({
      id: index + 1,
      customerName: review.customerName,
      location: review.location,
      rating: review.rating,
      title: review.title,
      body: review.body,
      date: new Date(`${review.date}T12:00:00.000Z`).toISOString(),
      productName: nameBySlug.get(review.slug) ?? review.slug,
      productSlug: review.slug,
    }));
}
