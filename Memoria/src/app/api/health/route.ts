import { checkDatabase } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkDatabase();
  if (result.ok) return Response.json({ ok: true });

  return Response.json(
    { ok: false, detail: result.detail },
    { status: 503 },
  );
}
