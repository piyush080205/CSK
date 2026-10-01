export async function sessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`${process.env.SESSION_SECRET ?? "dev-secret"}:${process.env.APP_PASSCODE ?? "cafe"}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export const COOKIE = "cafe_session";
