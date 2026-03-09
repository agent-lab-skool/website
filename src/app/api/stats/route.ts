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

  return NextResponse.json({
    range,
    stats,
    totals: {
      ...totals,
      rate:
        totals.views > 0
          ? ((totals.clicks / totals.views) * 100).toFixed(1)
          : "0",
    },
  });
}
