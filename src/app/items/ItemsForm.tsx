"use client";
import { useRouter } from "next/navigation";

type Item = { id: number; name: string; price: number };

export default function ItemsForm({ items }: { items: Item[] }) {
  const router = useRouter();
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await fetch("/api/items", { method: "POST", body: JSON.stringify({ name: f.get("name"), price: f.get("price") }) });
    e.currentTarget.reset();
    router.refresh();
  }
  return (
    <>
      <div className="card">
        {items.map((i) => (
          <div className="row" key={i.id}>
            <span>{i.name} — {i.price}</span>
            <button className="ghost small" onClick={async () => {
              await fetch(`/api/items?id=${i.id}`, { method: "DELETE" });
              router.refresh();
            }}>Remove</button>
          </div>
        ))}
      </div>
      <form className="card" onSubmit={add}>
        <h2>Add / update item</h2>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
        <label htmlFor="price">Default price</label>
        <input id="price" name="price" type="number" step="any" min="0" required />
        <div className="actions"><button>Save</button></div>
      </form>
    </>
  );
}
