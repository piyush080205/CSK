# Cafe Tab

Log tea/cigarette purchases at the cafe, then send an end-of-day summary to the owner by WhatsApp (click-to-share) and by email.

## Run
```
cp .env.example .env.local   # set APP_PASSCODE, SESSION_SECRET, CRON_SECRET, SMTP_*
npm install
npm run dev                  # http://localhost:3000
npm test                     # summary logic tests
```
1. Log in with the shared passcode.
2. **Settings**: your name, the owner's WhatsApp number (with country code), and emails for the daily summary.
3. **Today**: tap an item to add it, or use the form (also for recording payments). "Send on WhatsApp" opens WhatsApp with the summary pre-filled; "Email now" sends it immediately.

## Daily automatic email
Schedule a call to the cron endpoint at night, e.g. 22:00 with system cron:
```
0 22 * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://your-host/api/cron/daily-summary
```
Data lives in a SQLite file (`DATABASE_PATH`), so host somewhere with a persistent disk (Render/Railway disk, a small VPS). Serverless hosts like Vercel lose the file; switch to Postgres/Turso there.

## Later
Receiving WhatsApp replies (e.g. "tea 2 20") needs the Twilio or Meta WhatsApp Cloud API plus a webhook route.
