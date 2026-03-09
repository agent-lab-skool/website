import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "7d";

  const days = range === "30d" ? 30 : range === "all" ? 3650 : 7;
  const since = new Date(Date.now() - days * 86_400_000);

  const events = await prisma.pageEvent.groupBy({
    by: ["page", "event"] as const,
    where: { createdAt: { gte: since } },
    _count: true,
    orderBy: { _count: { page: "desc" } },
  });

  // Shape into { page: { views, clicks, rate } }
  const pages: Record<string, { views: number; clicks: number }> = {};

  for (const row of events) {
    const page = row.page;
    const event = row.event;
    const count = typeof row._count === "number" ? row._count : 0;
    if (!pages[page]) pages[page] = { views: 0, clicks: 0 };
    if (event === "view") pages[page].views = count;
    if (event === "cta_click") pages[page].clicks = count;
  }

  const stats = Object.entries(pages).map(([page, data]) => ({
    page,
    views: data.views,
    clicks: data.clicks,
    rate: data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(1) : "0",
  }));

  // Totals
  const totals = stats.reduce(
    (acc, s) => ({
      views: acc.views + s.views,
      clicks: acc.clicks + s.clicks,
    }),
    { views: 0, clicks: 0 }
  );

  // Daily breakdown for charts
  const allEvents = await prisma.pageEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { event: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap: Record<string, { views: number; clicks: number }> = {};

  // Pre-fill all days in range
  const displayDays = Math.min(days, 365);
  for (let i = 0; i < displayDays; i++) {
    const d = new Date(Date.now() - (displayDays - 1 - i) * 86_400_000);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { views: 0, clicks: 0 };
  }

  for (const e of allEvents) {
    const key = e.createdAt.toISOString().split("T")[0];
    if (!dailyMap[key]) dailyMap[key] = { views: 0, clicks: 0 };
    if (e.event === "view") dailyMap[key].views++;
    if (e.event === "cta_click") dailyMap[key].clicks++;
  }

  const daily = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    views: data.views,
    clicks: data.clicks,
    ctr: data.views > 0 ? Number(((data.clicks / data.views) * 100).toFixed(1)) : 0,
  }));

  return NextResponse.json({
    range,
    stats,
    daily,
    totals: {
      ...totals,
      rate:
        totals.views > 0
          ? ((totals.clicks / totals.views) * 100).toFixed(1)
          : "0",
    },
  });
}
