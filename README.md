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

## Deploy to Vercel (free, permanent link)
1. **Database (Turso):** sign up at turso.tech, create a database, then copy its URL (`libsql://...`) and create an auth token. Or with the CLI: `turso db create cafe`, `turso db show cafe --url`, `turso db tokens create cafe`.
2. **Vercel:** sign up at vercel.com with GitHub → *Add New Project* → import this repo (branch `claude/friendly-franklin-3tyr4e`, or merge it to `main` first).
3. In *Environment Variables* add: `APP_PASSCODE`, `SESSION_SECRET`, `CRON_SECRET` (long random strings), `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `APP_TIMEZONE` (e.g. `Asia/Kolkata`), and for email `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
4. Deploy, open the `*.vercel.app` link on your phone, and use "Add to Home Screen".

Tables are created automatically on first use.

## Daily automatic email
`vercel.json` calls `/api/cron/daily-summary` every day at 16:30 UTC (22:00 IST). Vercel sends `Authorization: Bearer $CRON_SECRET` automatically. Change the `schedule` in `vercel.json` for another time (it is in UTC). Elsewhere, use system cron:
```
0 22 * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://your-host/api/cron/daily-summary
```

## Later
Receiving WhatsApp replies (e.g. "tea 2 20") needs the Twilio or Meta WhatsApp Cloud API plus a webhook route.
