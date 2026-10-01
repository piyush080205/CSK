import { NextResponse } from "next/server";
import { sendDailyEmail } from "@/lib/daily";

export async function POST() {
  try {
    return NextResponse.json(await sendDailyEmail());
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
