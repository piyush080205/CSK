import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSummary, summaryText, whatsappLink, type Entry } from "./summary.ts";

const e = (o: Partial<Entry>): Entry => ({
  id: 1, date: "2026-10-01", kind: "purchase", item: "Tea", qty: 1, price: 20, note: "", added_by: "me", ...o,
});

test("totals today's items and carries outstanding balance", () => {
  const s = buildSummary(
    [
      e({ date: "2026-09-30", item: "Cigs", price: 200 }),
      e({ qty: 3 }),
      e({ item: "Cigs", qty: 2, price: 200 }),
      e({ date: "2026-10-02", qty: 9 }), // future, ignored
    ],
    "2026-10-01",
  );
  assert.equal(s.total, 460);
  assert.equal(s.outstanding, 660);
  assert.deepEqual(s.lines.map((l) => l.item), ["Tea", "Cigs"]);
});

test("payments reduce outstanding", () => {
  const s = buildSummary([e({ qty: 5 }), e({ kind: "payment", item: "Payment", price: 50 })], "2026-10-01");
  assert.equal(s.paid, 50);
  assert.equal(s.outstanding, 50);
  assert.match(summaryText(s), /Paid 50\. Outstanding: 50$/);
});

test("whatsapp link strips non-digits and encodes text", () => {
  assert.equal(whatsappLink("+91 98765-43210", "a b"), "https://wa.me/919876543210?text=a%20b");
});
