"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/summary";

type Item = { id: number; name: string; price: number };

export default function QuickAdd({ items, who, date, phone }: { items: Item[]; who: string; date: string; phone: string }) {
  const router = useRouter();
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [kind, setKind] = useState<"purchase" | "payment">("purchase");
  const [note, setNote] = useState("");

  const [notify, setNotify] = useState(false);
  useEffect(() => {
    try { setNotify(localStorage.getItem("notify") === "1"); } catch {}
  }, []);

  type Body = { kind?: "purchase" | "payment"; item: string; qty: number | string; price: number | string; note?: string };

  async function add(body: Body) {
    // Open WhatsApp synchronously inside the click so popup blockers allow it.
    if (notify && phone) {
      const amt = Number(body.qty) * Number(body.price);
      const text = body.kind === "payment"
        ? `${who || "I"} paid ${amt}`
        : `${body.item} x${body.qty} = ${amt} added by ${who || "me"}`;
      window.open(whatsappLink(phone, text), "_blank");
    }
    await fetch("/api/entries", { method: "POST", body: JSON.stringify({ added_by: who, date, ...body }) });
    router.refresh();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await add({ kind, item: kind === "payment" ? "Payment" : item, qty: kind === "payment" ? 1 : qty, price, note });
    setNote("");
  }

  return (
    <div className="card">
      <h2>Quick add</h2>
      <label style={{ display: "flex", gap: 8, alignItems: "center", color: "inherit", fontSize: "1em" }}>
        <input type="checkbox" style={{ width: "auto" }} checked={notify} onChange={(e) => {
          setNotify(e.target.checked);
          try { localStorage.setItem("notify", e.target.checked ? "1" : "0"); } catch {}
        }} />
        Open WhatsApp to notify owner after each add
      </label>
      {notify && !phone && <p className="msg">Set the owner&apos;s WhatsApp number in Settings first.</p>}
      <div className="grid">
        {items.map((i) => (
          <button key={i.id} onClick={() => add({ item: i.name, qty: 1, price: i.price })}>
            {i.name}<br /><small>+1 · {i.price}</small>
          </button>
        ))}
      </div>
      <form onSubmit={submit}>
        <label htmlFor="kind">Type</label>
        <select id="kind" value={kind} onChange={(e) => setKind(e.target.value as "purchase" | "payment")}>
          <option value="purchase">Purchase</option>
          <option value="payment">Payment (I paid)</option>
        </select>
        {kind === "purchase" && (
          <>
            <label htmlFor="item">Item</label>
            <input id="item" list="items" value={item} required onChange={(e) => {
              setItem(e.target.value);
              const m = items.find((i) => i.name === e.target.value);
              if (m) setPrice(String(m.price));
            }} />
            <datalist id="items">{items.map((i) => <option key={i.id} value={i.name} />)}</datalist>
            <label htmlFor="qty">Quantity</label>
            <input id="qty" type="number" step="any" min="0.01" value={qty} onChange={(e) => setQty(e.target.value)} required />
          </>
        )}
        <label htmlFor="price">{kind === "payment" ? "Amount" : "Price each"}</label>
        <input id="price" type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <label htmlFor="note">Note (optional)</label>
        <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="actions"><button>Add entry</button></div>
      </form>
    </div>
  );
}
