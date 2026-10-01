import { NextResponse } from "next/server";
import { setSetting } from "@/lib/db";

export async function POST(req: Request) {
  const b = await req.json();
  for (const k of ["owner_phone", "my_name", "emails"]) if (typeof b[k] === "string") setSetting(k, b[k].trim());
  return NextResponse.json({ ok: true });
}
