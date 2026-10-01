import { allEntries } from "@/lib/db";
import { buildSummary, summaryText } from "@/lib/summary";

export const dynamic = "force-dynamic";

export default async function History() {
  const entries = await allEntries();
  const dates = [...new Set(entries.map((e) => e.date))].reverse();
  return (
    <>
      <h1>History</h1>
      {dates.map((d) => (
        <div className="card" key={d}>
          {summaryText(buildSummary(entries, d))}
        </div>
      ))}
      {!dates.length && <p className="muted">No entries yet.</p>}
    </>
  );
}
