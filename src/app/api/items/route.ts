import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name, price } = await req.json();
  if (!name || !Number.isFinite(Number(price))) return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  db.prepare("INSERT INTO items (name, price) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET price = excluded.price").run(
    String(name).trim(), Number(price),
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  db.prepare("DELETE FROM items WHERE id = ?").run(Number(new URL(req.url).searchParams.get("id")));
  return NextResponse.json({ ok: true });
}
