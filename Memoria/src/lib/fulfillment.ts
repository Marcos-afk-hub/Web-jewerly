import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog-config";

export const deliveryMethods = [
  {
    id: "domicilio",
    name: "Envío a domicilio",
    description: "FedEx a toda la República Mexicana con número de rastreo. 2 a 5 días hábiles.",
    cost: 180,
    note: `Gratis en compras mayores a $${FREE_SHIPPING_THRESHOLD.toLocaleString("es-MX")} MXN`,
  },
  {
    id: "tienda",
    name: "Recoger en HILO MÍO",
    description: "En nuestro establecimiento de Metepec, Estado de México. Te avisamos cuando esté lista.",
    cost: 0,
    note: "Sin costo",
  },
  {
    id: "punto",
    name: "Entrega en punto de encuentro",
    description: "Puntos y horarios establecidos en el Estado de México, atendidos por nuestro equipo.",
    cost: 60,
    note: "$60 MXN",
  },
] as const;

export type DeliveryMethodId = (typeof deliveryMethods)[number]["id"];

export const pickupPoints = [
  { id: "metepec-centro", name: "Metepec Centro", schedule: "Martes y jueves · 17:00 a 19:00 h" },
  { id: "toluca-alameda", name: "Toluca · Alameda Central", schedule: "Miércoles · 12:00 a 14:00 h" },
  { id: "lerma-plaza", name: "Lerma · Plaza Outlet", schedule: "Sábados · 11:00 a 13:00 h" },
  { id: "naucalpan-satelite", name: "Naucalpan · Ciudad Satélite", schedule: "Sábados · 16:00 a 18:00 h" },
] as const;

export const garmentMethods = [
  {
    id: "fedex",
    name: "Envío por paquetería FedEx",
    description: "Te enviamos por correo una guía prepagada e instrucciones de empaque. FedEx recolecta en tu domicilio o lo dejas en una sucursal.",
    cost: 0,
    note: "Guía incluida en tu pedido",
    steps: ["Recibes instrucciones de empaque y tu guía FedEx", "Preparas tu paquete siguiendo la guía", "FedEx recolecta o lo entregas en sucursal", "Confirmamos la recepción de tu prenda"],
  },
  {
    id: "punto",
    name: "Entrega en punto de recolección",
    description: "Una colaboradora de HILO MÍO recibe tu prenda en nuestros puntos y horarios establecidos del Estado de México.",
    cost: 0,
    note: "Sin costo",
    steps: ["Eliges el punto y horario que te acomode", "Entregas tu prenda en una bolsa cerrada", "Te damos un comprobante de recepción", "Tu pedido avanza a elaboración"],
  },
  {
    id: "mensajeria",
    name: "Recolección por mensajería local",
    description: "Programamos una recolección con Uber o DiDi Entrega en zonas con cobertura: Toluca, Metepec, Lerma y Zinacantepec.",
    cost: 90,
    note: "$90 MXN · sujeto a cobertura",
    steps: ["Coordinamos día y hora por WhatsApp", "El mensajero recoge el paquete cerrado", "Compartimos el seguimiento en tiempo real", "Confirmamos la recepción de tu prenda"],
  },
] as const;

export type GarmentMethodId = (typeof garmentMethods)[number]["id"];

export const paymentMethods = [
  { id: "tarjeta", name: "Tarjeta de crédito o débito", description: "Pago seguro en línea. Se habilita al conectar la pasarela (Stripe o Mercado Pago).", available: false },
  { id: "spei", name: "Transferencia SPEI", description: "Te compartimos la CLABE al confirmar tu pedido. Tu pieza entra a producción al validar el pago.", available: true },
  { id: "tienda", name: "Pago en establecimiento", description: "Paga al recoger tu pedido en HILO MÍO (efectivo o tarjeta).", available: true, onlyFor: "tienda" },
] as const;

export const orderStatuses = [
  { id: "confirmado", label: "Pedido confirmado", description: "Recibimos tu pedido y lo estamos revisando.", memoriaOnly: false },
  { id: "pendiente_prenda", label: "Pendiente de recibir la prenda", description: "Esperamos tu textil según el método que elegiste.", memoriaOnly: true },
  { id: "material_recibido", label: "Material recibido", description: "Tu prenda llegó bien y la resguardamos con cuidado.", memoriaOnly: true },
  { id: "en_elaboracion", label: "En proceso de elaboración", description: "Nuestro taller está trabajando en tu pieza.", memoriaOnly: false },
  { id: "terminado", label: "Producto terminado", description: "La pieza pasó control de calidad y empaque.", memoriaOnly: true },
  { id: "enviado", label: "Enviado o listo para entrega", description: "Va en camino o te espera en el punto elegido.", memoriaOnly: false },
  { id: "entregado", label: "Pedido entregado", description: "¡Disfruta tu pieza! Gracias por confiar en HILO MÍO.", memoriaOnly: false },
] as const;

export type OrderStatusId = (typeof orderStatuses)[number]["id"];

export function stagesFor(hasMemoria: boolean) {
  return orderStatuses.filter((status) => hasMemoria || !status.memoriaOnly);
}

export function statusLabel(id: string) {
  return orderStatuses.find((status) => status.id === id)?.label ?? id;
}

export function calculateDeliveryCost(subtotal: number, deliveryMethod: string) {
  const method = deliveryMethods.find((item) => item.id === deliveryMethod);
  if (!method) return 0;
  if (method.id === "domicilio" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.cost;
}

export function calculateGarmentCost(garmentMethod: string | null | undefined) {
  if (!garmentMethod) return 0;
  return garmentMethods.find((item) => item.id === garmentMethod)?.cost ?? 0;
}

export function deliveryName(id: string | null | undefined) {
  return deliveryMethods.find((item) => item.id === id)?.name ?? "Por definir";
}

export function garmentName(id: string | null | undefined) {
  return garmentMethods.find((item) => item.id === id)?.name ?? "No aplica";
}

export function paymentName(id: string | null | undefined) {
  return paymentMethods.find((item) => item.id === id)?.name ?? "Por definir";
}

export function pickupPointName(id: string | null | undefined) {
  return pickupPoints.find((item) => item.id === id)?.name ?? null;
}
