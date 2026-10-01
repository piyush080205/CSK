import { allEntries, getSettings } from "./db";
import { sendEmail } from "./email";
import { buildSummary, summaryText, todayStr } from "./summary";

export async function sendDailyEmail(date = todayStr()) {
  const emails = (getSettings().emails ?? "").split(/[,\s]+/).filter(Boolean);
  if (!emails.length) throw new Error("No email addresses set in Settings");
  const text = summaryText(buildSummary(allEntries(), date));
  await sendEmail(emails, `Cafe tab – ${date}`, text);
  return { sent: emails.length, text };
}
