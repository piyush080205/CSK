import { allEntries, allItems, entriesOn, getSettings } from "@/lib/db";
import { amountOf, buildSummary, summaryText, todayStr, whatsappLink } from "@/lib/summary";
import QuickAdd from "./QuickAdd";
import { CopyButton, DeleteButton, EmailNow } from "./Actions";

export const dynamic = "force-dynamic";

export default function Today() {
  const date = todayStr();
  const settings = getSettings();
  const entries = entriesOn(date);
  const summary = buildSummary(allEntries(), date);
  const text = summaryText(summary);
  const phone = settings.owner_phone;

  return (
    <>
      <h1>Today <span className="muted">{date}</span></h1>
      <QuickAdd items={allItems()} who={settings.my_name || "me"} date={date} />

      <div className="card">
        <div className="muted">Today&apos;s total</div>
        <div className="big">{summary.total}</div>
        <div className="muted">Outstanding balance: <b>{summary.outstanding}</b></div>
        {entries.map((e) => (
          <div className="row" key={e.id}>
            <div>
              {e.kind === "payment" ? "Payment" : `${e.item} × ${e.qty}`}
              <div className="muted">{e.added_by}{e.note ? ` · ${e.note}` : ""}</div>
            </div>
            <div>{e.kind === "payment" ? "−" : ""}{amountOf(e)} <DeleteButton id={e.id} /></div>
          </div>
        ))}
        {!entries.length && <p className="muted">Nothing logged yet today.</p>}
      </div>

      <div className="card">
        <h2>End-of-day summary</h2>
        <p>{text}</p>
        <div className="actions">
          {phone ? (
            <a className="btn" href={whatsappLink(phone, text)} target="_blank" rel="noreferrer">Send on WhatsApp</a>
          ) : (
            <a className="btn ghost" href="/settings">Set WhatsApp number</a>
          )}
          <CopyButton text={text} />
          <EmailNow />
        </div>
      </div>
    </>
  );
}
