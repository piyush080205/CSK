import { getSettings } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <SettingsForm initial={await getSettings()} />
    </>
  );
}
