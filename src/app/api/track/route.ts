import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = [
  "view",
  "cta_click",
  "scroll_25",
  "scroll_50",
  "scroll_75",
  "scroll_100",
  "time_on_page",
  "time_to_cta",
];

export async function POST(req: NextRequest) {
  try {
    const { page, event, value } = await req.json();

    if (
      typeof page !== "string" ||
      typeof event !== "string" ||
      !ALLOWED_EVENTS.includes(event)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let sanitizedValue: number | undefined;
    if (value !== undefined && value !== null) {
      if (typeof value !== "number" || value < 0) {
        return NextResponse.json({ error: "Invalid value" }, { status: 400 });
      }
      if (event === "time_on_page" || event === "time_to_cta") {
        sanitizedValue = Math.min(value, 3600);
      } else {
        sanitizedValue = value;
      }
    }

    await prisma.pageEvent.create({
      data: { page, event, value: sanitizedValue },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
