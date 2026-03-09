import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { page, event } = await req.json();

    if (
      typeof page !== "string" ||
      typeof event !== "string" ||
      !["view", "cta_click"].includes(event)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.pageEvent.create({
      data: { page, event },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
