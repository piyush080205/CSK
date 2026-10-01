"use client";
import { useState } from "react";

export default function Login() {
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const passcode = new FormData(e.currentTarget).get("passcode");
    const r = await fetch("/api/login", { method: "POST", body: JSON.stringify({ passcode }) });
    if (r.ok) location.href = "/";
    else setErr("Wrong passcode");
  }
  return (
    <form className="card" onSubmit={submit}>
      <h1>Cafe Tab</h1>
      <label htmlFor="passcode">Passcode</label>
      <input id="passcode" name="passcode" type="password" autoFocus required />
      <div className="actions"><button>Enter</button></div>
      {err && <p className="msg">{err}</p>}
    </form>
  );
}
