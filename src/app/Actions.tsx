"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  return (
    <button className="ghost small" aria-label="Delete entry" onClick={async () => {
      if (!confirm("Delete this entry?")) return;
      await fetch(`/api/entries?id=${id}`, { method: "DELETE" });
      router.refresh();
    }}>✕</button>
  );
}

export function EmailNow() {
  const [msg, setMsg] = useState("");
  return (
    <>
      <button className="ghost" onClick={async () => {
        setMsg("Sending…");
        const r = await fetch("/api/send-email", { method: "POST" });
        const j = await r.json();
        setMsg(r.ok ? `Emailed ${j.sent} address(es)` : `Failed: ${j.error}`);
      }}>Email now</button>
      {msg && <span className="msg">{msg}</span>}
    </>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button className="ghost" onClick={async () => {
      await navigator.clipboard.writeText(text);
      setDone(true);
    }}>{done ? "Copied" : "Copy"}</button>
  );
}
