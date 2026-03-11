import { NextRequest, NextResponse } from "next/server";
import { fetchStats } from "@/app/dashboard/_lib/fetch-stats";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "7d";
  const data = await fetchStats(range);
  return NextResponse.json(data);
}
