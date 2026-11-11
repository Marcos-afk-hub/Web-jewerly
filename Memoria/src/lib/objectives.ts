/**
 * Objetivos del proyecto — contenido editorial de la marca.
 *
 * Este archivo es la única fuente de verdad para los apartados de objetivos
 * (generales y específicos), el problema que se atiende y la propuesta de
 * valor. Las páginas `/objetivos` y la sección de `/nosotros` consumen estos
 * datos, de modo que editar el texto aquí se refleja en ambos lugares.
 */

export type Objective = {
  id: string;
  title: string;
  text: string;
};

export type Problem = {
  id: string;
  title: string;
  text: string;
};

export const generalObjectives: Objective[] = [
  {
    id: "og-1",
    title: "Inmortalizar recuerdos en objetos que se usan a diario",
    text:
      "Transformar prendas significativas en joyería que forma parte del día a día, de modo que un recuerdo no quede archivado en una caja, sino a la vista y al alcance de la mano.",
  },
  {
    id: "og-2",
    title: "Sustentar un modelo de negocio rentable y replicable",
    text:
      "Consolidar una línea de producto con diferenciación clara frente a la joyería tradicional, con control de costos, márgenes definidos y una operación que pueda crecer sin perder el acabado artesanal.",
  },
  {
    id: "og-3",
    title: "Fortalecer una marca mexicana con identidad propia",
    text:
      "Construir HILO MÍO como una marca de joyería nacional reconocible, con un lenguaje visual coherente y una línea de producto —MEMORIA— que le da a la marca un carácter propio.",
  },
  {
    id: "og-4",
    title: "Generar empleo y arraigo en el Estado de México",
    text:
      "Mantener el diseño, el taller y el despacho dentro del estado, trabajar con proveedores locales y crear plazas de trabajo en la región donde nacimos.",
  },
  {
    id: "og-5",
    title: "Promover el consumo consciente y la economía circular",
    text:
      "Dar una segunda vida a prendas que ya no se usan, evitando que terminen en la basura y enseñando a nuestros clientes que un objeto puede guardar una historia sin dejar de ser útil.",
  },
];

export const specificObjectives: Objective[] = [
  {
    id: "oe-1",
    title: "Diseñar y producir la primera colección MEMORIA",
    text:
      "Desarrollar dijes, collares, pulseras, aretes y sets con fragmento textil, documentando materiales, medidas y tiempos de elaboración de cada pieza.",
  },
  {
    id: "oe-2",
    title: "Construir el catálogo y la tienda en línea",
    text:
      "Publicar el catálogo completo con filtros por categoría, material y estilo, fichas de producto con variantes y reseñas, carrito, checkout y seguimiento de pedidos.",
  },
  {
    id: "oe-3",
    title: "Implementar un personalizador de piezas",
    text:
      "Permitir que cada cliente elija tipo de pieza, material, tono, cadena, forma, piedra, dije y acabado, con cálculo de precio en vivo y un resumen que se guarda con la orden.",
  },
  {
    id: "oe-4",
    title: "Establecer el proceso de recepción de prendas",
    text:
      "Definir y documentar el flujo completo: envío de la prenda, selección del fragmento, sellado, montaje, control de calidad, devolución del excedente y entrega.",
  },
  {
    id: "oe-5",
    title: "Cerrar el circuito de comunicación y atención",
    text:
      "Atender por WhatsApp en cada etapa, avisar el avance del pedido y resolver dudas de tallas, materiales y cuidados con respuestas rápidas y humanas.",
  },
  {
    id: "oe-6",
    title: "Medir la respuesta del público y ajustar la oferta",
    text:
      "Dar seguimiento a las ventas por línea, categoría y origen, registrar las reseñas de los clientes y usar esa información para decidir qué piezas producir en la siguiente temporada.",
  },
];

export const problems: Problem[] = [
  {
    id: "p-1",
    title: "Los recuerdos se guardan, pero no se llevan",
    text:
      "Las prendas con valor sentimental suelen terminar dobladas en un cajón o encerradas en una bolsa. Guardan la historia, pero dejan de estar presentes en la vida diaria.",
  },
  {
    id: "p-2",
    title: "Las alternativas existentes son vínculos, no joyería",
    text:
      "Los peluches, los relics y los marcos son un recordatorio hermoso, pero no se usan, no combinan con la ropa y reservan su apariencia para ocasiones especiales.",
  },
  {
    id: "p-3",
    title: "La joyería personalizada tradicional es cara y rígida",
    text:
      "La joyería a medida obliga a elegir entre piezas de catálogo o pagar una personalización que casi nadie alcanza. Falta una opción intermedia, sensible y accesible.",
  },
];

export const proposal = {
  eyebrow: "Nuestra propuesta",
  title: "Un fragmento de tu prenda, conservado y llevado contigo.",
  paragraphs: [
    "MEMORIA es una línea de joyería que integra un pequeño fragmento de una prenda significativa —una camisa, un mameluco, una playera— dentro de piezas de plata, oro laminado y acero, protegido bajo cristal.",
    "El cliente diseña su pieza, nos envía la prenda, nosotros elegimos el fragmento más representativo, lo sellamos, lo montamos y te lo devolvemos listo para usar. El resto de la prenda regresa intacto a tu casa.",
  ],
  bullets: [
    "Un mismo fragmento puede dar lugar a varias piezas: un set completo o una joya para cada miembro de la familia.",
    "Proceso transparente, con avance por etapas y vista previa antes de montar.",
    "Calidad de joyería real: plata .925, oro laminado 14k y acero inoxidable hipoalergénico.",
  ],
};

export const audiences = [
  {
    id: "a-1",
    title: "Familias",
    text: "Padres, madres e hijos que quieren llevar cerca la ropa de una persona querida.",
  },
  {
    id: "a-2",
    title: "Parejas",
    text: "Quien busca un regalo con historia en lugar de un objeto genérico.",
  },
  {
    id: "a-3",
    title: "Homenajes y eventos",
    text: "Bodas, aniversarios, nacimientos, graduaciones y momentos que no se repiten.",
  },
  {
    id: "a-4",
    title: "Marcas y empresas",
    text: "Regalos corporativos con un detalle único, como un uniforme o una playera de equipo.",
  },
];

export const impact = [
  {
    id: "i-1",
    label: "Textil reutilizado",
    value: "Cada pieza evita que una prenda termine desechada.",
  },
  {
    id: "i-2",
    label: "Taller local",
    value: "Diseño, manufactura y despacho dentro del Estado de México.",
  },
  {
    id: "i-3",
    label: "Hecho a mano",
    value: "Cada fragmento se selecciona y se sella de forma artesanal.",
  },
];
