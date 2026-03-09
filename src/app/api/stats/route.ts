import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllGuides } from "@/app/guides/_lib/guides";

export const dynamic = "force-dynamic";

interface InroScenario {
  id: number;
  title: string;
  metrics: {
    executions: { total: number; last_7_days: number };
    conversions: { total: number; last_7_days: number };
  };
}

async function fetchInroScenarios(): Promise<InroScenario[]> {
  const key = process.env.INRO_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      "https://api.inro.social/api/v1/scenarios?per_page=100",
      { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.scenarios ?? [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "7d";

  const days = range === "30d" ? 30 : range === "all" ? 3650 : 7;
  const since = new Date(Date.now() - days * 86_400_000);

  // Fetch DB events and Inro scenarios in parallel
  const [events, allEvents, inroScenarios] = await Promise.all([
    prisma.pageEvent.groupBy({
      by: ["page", "event"] as const,
      where: { createdAt: { gte: since } },
      _count: true,
      orderBy: { _count: { page: "desc" } },
    }),
    prisma.pageEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { event: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    fetchInroScenarios(),
  ]);

  // Build scenario ID → metrics lookup
  const scenarioMap = new Map<number, InroScenario>();
  for (const s of inroScenarios) {
    scenarioMap.set(s.id, s);
  }

  // Build guide slug → DMs sent lookup
  const guides = getAllGuides();
  const use7d = range === "7d";
  let totalDms = 0;
  const pageDms: Record<string, number> = {};

  for (const guide of guides) {
    if (!guide.inroScenarioIds?.length) continue;
    const page = `/guides/${guide.slug}`;
    let dms = 0;
    for (const id of guide.inroScenarioIds) {
      const scenario = scenarioMap.get(id);
      if (!scenario) continue;
      dms += use7d
        ? scenario.metrics.executions.last_7_days
        : scenario.metrics.executions.total;
    }
    pageDms[page] = dms;
    totalDms += dms;
  }

  // Shape into { page: { views, clicks } }
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
    dms: pageDms[page] ?? 0,
    views: data.views,
    clicks: data.clicks,
    rate: data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(1) : "0",
  }));

  // Totals
  const totals = stats.reduce(
    (acc, s) => ({
      dms: acc.dms + s.dms,
      views: acc.views + s.views,
      clicks: acc.clicks + s.clicks,
    }),
    { dms: totalDms, views: 0, clicks: 0 }
  );

  // Daily breakdown for charts
  const dailyMap: Record<string, { views: number; clicks: number }> = {};

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
