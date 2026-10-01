import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const { name, price } = await req.json();
  if (!name || !Number.isFinite(Number(price))) return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  await query("INSERT INTO items (name, price) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET price = excluded.price", [
    String(name).trim(), Number(price),
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  await query("DELETE FROM items WHERE id = ?", [Number(new URL(req.url).searchParams.get("id"))]);
  return NextResponse.json({ ok: true });
}
