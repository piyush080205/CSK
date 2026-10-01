export type Entry = {
  id: number;
  date: string; // YYYY-MM-DD
  kind: "purchase" | "payment";
  item: string;
  qty: number;
  price: number;
  note: string;
  added_by: string;
};

export const amountOf = (e: Pick<Entry, "qty" | "price">) => e.qty * e.price;

export type Summary = {
  date: string;
  lines: { item: string; qty: number; total: number }[];
  total: number;
  paid: number;
  outstanding: number;
};

/** Balance = all purchases up to and including `date` minus all payments. */
export function buildSummary(all: Entry[], date: string): Summary {
  const byItem = new Map<string, { qty: number; total: number }>();
  let total = 0;
  let paid = 0;
  let owed = 0;
  for (const e of all) {
    if (e.date > date) continue;
    const amt = amountOf(e);
    if (e.kind === "payment") {
      owed -= amt;
      if (e.date === date) paid += amt;
      continue;
    }
    owed += amt;
    if (e.date !== date) continue;
    total += amt;
    const cur = byItem.get(e.item) ?? { qty: 0, total: 0 };
    cur.qty += e.qty;
    cur.total += amt;
    byItem.set(e.item, cur);
  }
  return {
    date,
    lines: [...byItem].map(([item, v]) => ({ item, ...v })),
    total,
    paid,
    outstanding: owed,
  };
}

const money = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export function summaryText(s: Summary): string {
  const d = new Date(s.date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const items = s.lines.length
    ? s.lines.map((l) => `${l.item} x${l.qty} = ${money(l.total)}`).join(", ")
    : "No purchases";
  let out = `${d}: ${items}. Total ${money(s.total)}.`;
  if (s.paid) out += ` Paid ${money(s.paid)}.`;
  out += ` Outstanding: ${money(s.outstanding)}`;
  return out;
}

export function whatsappLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const todayStr = (now = new Date()) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
};
