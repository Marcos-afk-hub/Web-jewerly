import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "hilomio_admin";
const DEMO_PASSWORD = "hilomio-admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEMO_PASSWORD;
}

export function isUsingDemoPassword() {
  return !process.env.ADMIN_PASSWORD;
}

export function adminSessionToken() {
  return createHash("sha256").update(`hilomio-session:${getAdminPassword()}`).digest("hex");
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminSessionToken();
}
