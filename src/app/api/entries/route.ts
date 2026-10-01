import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { todayStr } from "@/lib/summary";

export async function POST(req: Request) {
  const b = await req.json();
  const kind = b.kind === "payment" ? "payment" : "purchase";
  const qty = Number(b.qty ?? 1);
  const price = Number(b.price ?? 0);
  if (!b.item || !Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price < 0) {
    return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
  }
  await query("INSERT INTO entries (date, kind, item, qty, price, note, added_by) VALUES (?,?,?,?,?,?,?)", [
    b.date || todayStr(), kind, String(b.item), qty, price, String(b.note ?? ""), String(b.added_by ?? ""),
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  await query("DELETE FROM entries WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
