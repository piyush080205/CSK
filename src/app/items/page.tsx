import { allItems } from "@/lib/db";
import ItemsForm from "./ItemsForm";

export const dynamic = "force-dynamic";

export default function Items() {
  return (
    <>
      <h1>Items</h1>
      <ItemsForm items={allItems()} />
    </>
  );
}
