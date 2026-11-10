import { brand } from "@/lib/catalog-config";
import { statusLabel } from "@/lib/fulfillment";

type NotificationInput = {
  to: string;
  subject: string;
  text: string;
};

export type NotificationResult = { sent: boolean; channel: "email" | "registro" };

export async function sendNotification({ to, subject, text }: NotificationInput): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATIONS_FROM ?? `HILO MÍO <pedidos@${brand.email.split("@")[1] ?? "hilomio.mx"}>`;
  if (!apiKey) {
    console.info(`[notificaciones] RESEND_API_KEY no configurada. Correo omitido para ${to}: ${subject}`);
    return { sent: false, channel: "registro" };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    return { sent: response.ok, channel: response.ok ? "email" : "registro" };
  } catch (error) {
    console.error("[notificaciones] Error al enviar correo", error);
    return { sent: false, channel: "registro" };
  }
}

export function orderConfirmationMessage(input: { orderNumber: string; fullName: string; total: string; hasMemoria: boolean; garmentMethod: string | null }) {
  const lines = [
    `Hola ${input.fullName},`,
    "",
    `Recibimos tu pedido ${input.orderNumber} por ${input.total}. ¡Gracias por confiar en HILO MÍO!`,
  ];
  if (input.hasMemoria) {
    lines.push("", "Tu pedido incluye piezas MEMORIA. Siguiente paso: hacernos llegar tu prenda.");
    if (input.garmentMethod === "fedex") lines.push("En las próximas horas recibirás tu guía FedEx prepagada e instrucciones de empaque.");
    if (input.garmentMethod === "punto") lines.push("Te confirmaremos por WhatsApp el punto y horario de recolección que elegiste.");
    if (input.garmentMethod === "mensajeria") lines.push("Te escribiremos por WhatsApp para coordinar la recolección con mensajería local.");
  }
  lines.push("", `Puedes seguir tu pedido en línea con tu número de pedido y tu correo.`, "", "HILO MÍO · Joyas que cuentan historias.");
  return lines.join("\n");
}

export function statusChangeMessage(input: { orderNumber: string; fullName: string; status: string; note?: string }) {
  return [
    `Hola ${input.fullName},`,
    "",
    `Tu pedido ${input.orderNumber} cambió de estatus: ${statusLabel(input.status)}.`,
    input.note ? `Nota del taller: ${input.note}` : "",
    "",
    "Consulta el detalle en la sección Rastrear pedido de hilomio.mx.",
    "",
    "HILO MÍO · Joyas que cuentan historias.",
  ].filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n");
}
