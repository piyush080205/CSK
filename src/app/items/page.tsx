import { allItems } from "@/lib/db";
import ItemsForm from "./ItemsForm";

export const dynamic = "force-dynamic";

export default async function Items() {
  return (
    <>
      <h1>Items</h1>
      <ItemsForm items={await allItems()} />
    </>
  );
}
