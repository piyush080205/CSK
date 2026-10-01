import { getSettings } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <SettingsForm initial={getSettings()} />
    </>
  );
}
