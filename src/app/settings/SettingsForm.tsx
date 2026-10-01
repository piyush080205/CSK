"use client";
import { useState } from "react";

export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [msg, setMsg] = useState("");
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(["my_name", "owner_phone", "emails"].map((k) => [k, f.get(k)]));
    const r = await fetch("/api/settings", { method: "POST", body: JSON.stringify(body) });
    setMsg(r.ok ? "Saved" : "Failed to save");
  }
  return (
    <form className="card" onSubmit={save}>
      <label htmlFor="my_name">Your name (tagged on entries)</label>
      <input id="my_name" name="my_name" defaultValue={initial.my_name ?? ""} />
      <label htmlFor="owner_phone">Owner&apos;s WhatsApp number (with country code)</label>
      <input id="owner_phone" name="owner_phone" placeholder="+91 98765 43210" defaultValue={initial.owner_phone ?? ""} />
      <label htmlFor="emails">Emails for the daily summary (comma separated)</label>
      <input id="emails" name="emails" defaultValue={initial.emails ?? ""} />
      <div className="actions"><button>Save</button></div>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}
