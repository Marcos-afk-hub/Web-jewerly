import type { MemoriaDesign } from "@/lib/types";

export type MemoriaOption = {
  id: string;
  name: string;
  description?: string;
  extra: number;
};

export const memoriaProducts = [
  { id: "collar", name: "Collar", basePrice: 1890, image: "/images/collar-abrazo.jpg", description: "Medallón con tu textil y cadena a elegir.", textile: "3 × 3 cm", leadTime: "12–15 días hábiles" },
  { id: "pulsera", name: "Pulsera", basePrice: 1690, image: "/images/pulsera-hilo.jpg", description: "Dije oval con fragmento textil y cadena ajustable.", textile: "3 × 3 cm", leadTime: "12–15 días hábiles" },
  { id: "aretes", name: "Aretes", basePrice: 1390, image: "/images/aretes-rosal.jpg", description: "Par de aretes con dos pequeños fragmentos.", textile: "4 × 4 cm", leadTime: "10–12 días hábiles" },
  { id: "dije", name: "Dije", basePrice: 1290, image: "/images/dije-lumbre.jpg", description: "Dije individual para usar con tu cadena favorita.", textile: "3 × 3 cm", leadTime: "10–12 días hábiles" },
  { id: "set", name: "Set de joyería", basePrice: 4290, image: "/images/estuche-memoria.jpg", description: "Collar, pulsera y aretes a juego con el mismo textil.", textile: "8 × 8 cm", leadTime: "15–18 días hábiles" },
] as const;

export type MemoriaProductId = (typeof memoriaProducts)[number]["id"];

export const memoriaMaterials: MemoriaOption[] = [
  { id: "acero", name: "Acero inoxidable", description: "Resistente al uso diario, hipoalergénico.", extra: 0 },
  { id: "plata", name: "Plata .925", description: "Plata de ley con acabado de joyería.", extra: 650 },
  { id: "oro-laminado", name: "Oro laminado 14k", description: "Capa gruesa de oro sobre base de latón.", extra: 480 },
];

export const memoriaTones = [
  { id: "dorado", name: "Dorado", materials: ["acero", "oro-laminado"], extra: 0 },
  { id: "plateado", name: "Plateado", materials: ["acero", "plata"], extra: 0 },
  { id: "oro-rosa", name: "Oro rosa", materials: ["acero", "oro-laminado"], extra: 120 },
];

export const memoriaChains: MemoriaOption[] = [
  { id: "cable", name: "Cadena cable fina", description: "Clásica y ligera.", extra: 0 },
  { id: "rolo", name: "Cadena rolo", description: "Eslabones redondos, muy resistente.", extra: 120 },
  { id: "cuerda", name: "Cadena cuerda", description: "Trenzada, con más presencia.", extra: 180 },
  { id: "cordon", name: "Cordón ajustable", description: "Hilo encerado con nudo corredizo.", extra: 0 },
];

export const memoriaShapes: MemoriaOption[] = [
  { id: "oval", name: "Óvalo", extra: 0 },
  { id: "circulo", name: "Círculo", extra: 0 },
  { id: "gota", name: "Gota", extra: 60 },
  { id: "corazon", name: "Corazón", extra: 90 },
  { id: "rectangulo", name: "Rectángulo", extra: 0 },
];

export const memoriaStones: MemoriaOption[] = [
  { id: "ninguna", name: "Sin piedra", extra: 0 },
  { id: "zirconia", name: "Zirconia blanca", extra: 150 },
  { id: "cuarzo-rosa", name: "Cuarzo rosa", extra: 220 },
  { id: "perla", name: "Perla cultivada", extra: 260 },
  { id: "onix", name: "Ónix", extra: 200 },
];

export const memoriaCharms: MemoriaOption[] = [
  { id: "ninguno", name: "Sin dije adicional", extra: 0 },
  { id: "inicial", name: "Inicial grabada", extra: 180 },
  { id: "fecha", name: "Fecha grabada", extra: 220 },
  { id: "corazon", name: "Mini corazón", extra: 160 },
  { id: "estrella", name: "Estrella", extra: 160 },
];

export const memoriaFinishes: MemoriaOption[] = [
  { id: "pulido", name: "Pulido brillante", extra: 0 },
  { id: "satinado", name: "Satinado", extra: 0 },
  { id: "martillado", name: "Martillado", extra: 120 },
];

export const textileTypes = [
  { id: "algodon", name: "Algodón o playera", accepted: true, note: "Ideal: se fija muy bien y conserva el color." },
  { id: "mezclilla", name: "Mezclilla", accepted: true, note: "Funciona muy bien; usamos la cara con mejor textura." },
  { id: "tejido", name: "Tejido o lana", accepted: true, note: "Lo sellamos para evitar que se deshilache." },
  { id: "seda", name: "Seda, satén o encaje", accepted: true, note: "Recomendado para collares y dijes." },
  { id: "deportivo", name: "Playera deportiva o uniforme", accepted: true, note: "Podemos incluir parte de un número o escudo pequeño." },
  { id: "bordado", name: "Bordado o rebozo", accepted: true, note: "Elegimos el motivo más representativo." },
  { id: "piel", name: "Piel o gamuza", accepted: true, note: "Solo para dijes y pulseras." },
  { id: "otro", name: "Otro textil", accepted: true, note: "Cuéntanos de qué se trata y lo revisamos contigo." },
] as const;

export const occasions = [
  { id: "ser-querido", name: "Recordar a un ser querido" },
  { id: "bebe", name: "La ropita de un bebé" },
  { id: "graduacion", name: "Una graduación o logro" },
  { id: "deporte", name: "Un campeonato o equipo" },
  { id: "pareja", name: "Una persona especial" },
  { id: "etapa", name: "Una etapa de mi vida" },
  { id: "otro", name: "Otro motivo" },
] as const;

export const garmentRequirements = [
  "La prenda debe estar limpia y completamente seca.",
  "Necesitamos solo un fragmento pequeño: entre 3 × 3 cm y 8 × 8 cm según la pieza.",
  "Si prefieres, puedes enviar la prenda completa y nosotros cortamos la parte que elijas.",
  "Evita textiles con restos de pegamento, moho o humedad.",
  "Indícanos si hay una zona especial (bordado, estampado, número) que quieras conservar.",
];

export const defaultDesign: MemoriaDesign = {
  product: "collar",
  material: "acero",
  tone: "dorado",
  chain: "cable",
  shape: "oval",
  stone: "ninguna",
  charm: "ninguno",
  finish: "pulido",
  textileType: "algodon",
  textileDescription: "",
  piecesFromGarment: 1,
  occasion: "ser-querido",
  notes: "",
};

export function chainApplies(product: string) {
  return product !== "aretes";
}

export function getMemoriaProduct(id: string) {
  return memoriaProducts.find((product) => product.id === id) ?? null;
}

function findOption(options: MemoriaOption[], id: string) {
  return options.find((option) => option.id === id) ?? null;
}

export function priceBreakdown(design: MemoriaDesign) {
  const product = getMemoriaProduct(design.product);
  const material = findOption(memoriaMaterials, design.material);
  const tone = memoriaTones.find((item) => item.id === design.tone) ?? null;
  const chain = chainApplies(design.product) ? findOption(memoriaChains, design.chain) : null;
  const shape = findOption(memoriaShapes, design.shape);
  const stone = findOption(memoriaStones, design.stone);
  const charm = findOption(memoriaCharms, design.charm);
  const finish = findOption(memoriaFinishes, design.finish);
  const multiplier = design.product === "set" ? 2 : 1;
  const lines = [
    { label: product?.name ?? "Pieza", amount: product?.basePrice ?? 0 },
    { label: material?.name ?? "Material", amount: (material?.extra ?? 0) * multiplier },
    { label: tone?.name ?? "Tono", amount: tone?.extra ?? 0 },
    ...(chain ? [{ label: chain.name, amount: chain.extra }] : []),
    { label: shape?.name ?? "Forma", amount: shape?.extra ?? 0 },
    { label: stone?.name ?? "Piedra", amount: stone?.extra ?? 0 },
    { label: charm?.name ?? "Dije", amount: charm?.extra ?? 0 },
    { label: finish?.name ?? "Acabado", amount: finish?.extra ?? 0 },
  ];
  return { lines, total: lines.reduce((sum, line) => sum + line.amount, 0) };
}

export function calculateMemoriaPrice(design: MemoriaDesign) {
  return priceBreakdown(design).total;
}

export function describeDesign(design: MemoriaDesign) {
  const parts = [
    findOption(memoriaMaterials, design.material)?.name,
    memoriaTones.find((tone) => tone.id === design.tone)?.name,
    chainApplies(design.product) ? findOption(memoriaChains, design.chain)?.name : null,
    findOption(memoriaShapes, design.shape)?.name,
    design.stone !== "ninguna" ? findOption(memoriaStones, design.stone)?.name : null,
    design.charm !== "ninguno" ? findOption(memoriaCharms, design.charm)?.name : null,
    findOption(memoriaFinishes, design.finish)?.name,
  ];
  return parts.filter(Boolean).join(" · ");
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function validateDesign(input: unknown): MemoriaDesign | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const product = getMemoriaProduct(cleanString(raw.product, 30));
  const material = findOption(memoriaMaterials, cleanString(raw.material, 30));
  const tone = memoriaTones.find((item) => item.id === cleanString(raw.tone, 30));
  const chain = findOption(memoriaChains, cleanString(raw.chain, 30));
  const shape = findOption(memoriaShapes, cleanString(raw.shape, 30));
  const stone = findOption(memoriaStones, cleanString(raw.stone, 30));
  const charm = findOption(memoriaCharms, cleanString(raw.charm, 30));
  const finish = findOption(memoriaFinishes, cleanString(raw.finish, 30));
  const textileType = textileTypes.find((item) => item.id === cleanString(raw.textileType, 30));
  const occasion = occasions.find((item) => item.id === cleanString(raw.occasion, 30));
  const pieces = Number(raw.piecesFromGarment);
  if (!product || !material || !tone || !chain || !shape || !stone || !charm || !finish || !textileType || !occasion) return null;
  if (!tone.materials.includes(material.id)) return null;
  if (!Number.isInteger(pieces) || pieces < 1 || pieces > 10) return null;
  return {
    product: product.id,
    material: material.id,
    tone: tone.id,
    chain: chain.id,
    shape: shape.id,
    stone: stone.id,
    charm: charm.id,
    finish: finish.id,
    textileType: textileType.id,
    textileDescription: cleanString(raw.textileDescription, 400),
    piecesFromGarment: pieces,
    occasion: occasion.id,
    notes: cleanString(raw.notes, 600),
  };
}
