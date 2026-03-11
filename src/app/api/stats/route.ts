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
  const [events, allEvents, inroScenarios, avgTimeOnPage, avgTimeToCta] = await Promise.all([
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
    prisma.pageEvent.groupBy({
      by: ["page"],
      where: { event: "time_on_page", createdAt: { gte: since } },
      _avg: { value: true },
    }),
    prisma.pageEvent.groupBy({
      by: ["page"],
      where: { event: "time_to_cta", createdAt: { gte: since } },
      _avg: { value: true },
    }),
  ]);

  // Build scenario ID → metrics lookup
  const scenarioMap = new Map<number, InroScenario>();
  for (const s of inroScenarios) {
    scenarioMap.set(s.id, s);
  }

  // Build guide slug → DMs sent lookup
  const guides = getAllGuides();
  let totalDms = 0;
  const pageDms: Record<string, number> = {};

  for (const guide of guides) {
    if (!guide.inroScenarioIds?.length) continue;
    const page = `/guides/${guide.slug}`;
    let dms = 0;
    for (const id of guide.inroScenarioIds) {
      const scenario = scenarioMap.get(id);
      if (!scenario) continue;
      dms += scenario.metrics.executions.total;
    }
    pageDms[page] = dms;
    totalDms += dms;
  }

  // Build avg lookups
  const avgTimeMap: Record<string, number> = {};
  for (const row of avgTimeOnPage) {
    avgTimeMap[row.page] = row._avg.value ?? 0;
  }
  const avgCtaMap: Record<string, number> = {};
  for (const row of avgTimeToCta) {
    avgCtaMap[row.page] = row._avg.value ?? 0;
  }

  // Shape into { page: { views, clicks, scroll counts } }
  const pages: Record<string, { views: number; clicks: number; scroll25: number; scroll50: number; scroll75: number; scroll100: number }> = {};

  for (const row of events) {
    const page = row.page;
    const event = row.event;
    const count = typeof row._count === "number" ? row._count : 0;
    if (!pages[page]) pages[page] = { views: 0, clicks: 0, scroll25: 0, scroll50: 0, scroll75: 0, scroll100: 0 };
    if (event === "view") pages[page].views = count;
    if (event === "cta_click") pages[page].clicks = count;
    if (event === "scroll_25") pages[page].scroll25 = count;
    if (event === "scroll_50") pages[page].scroll50 = count;
    if (event === "scroll_75") pages[page].scroll75 = count;
    if (event === "scroll_100") pages[page].scroll100 = count;
  }

  // Build page → scenarioIds lookup
  const pageScenarioIds: Record<string, number[]> = {};
  for (const guide of guides) {
    if (!guide.inroScenarioIds?.length) continue;
    pageScenarioIds[`/guides/${guide.slug}`] = guide.inroScenarioIds;
  }

  const stats = Object.entries(pages).map(([page, data]) => {
    const bounceRate = data.views > 0
      ? Number((((data.views - data.scroll25) / data.views) * 100).toFixed(1))
      : 0;
    const avgScrollDepth = data.views > 0
      ? Number((((data.scroll25 * 25 + data.scroll50 * 25 + data.scroll75 * 25 + data.scroll100 * 25) / data.views)).toFixed(1))
      : 0;
    return {
      page,
      dms: pageDms[page] ?? 0,
      views: data.views,
      clicks: data.clicks,
      rate: (pageDms[page] ?? 0) > 0 ? ((data.clicks / (pageDms[page] ?? 0)) * 100).toFixed(1) : "0",
      avgTimeOnPage: Math.round(avgTimeMap[page] ?? 0),
      bounceRate,
      avgTimeToCta: Math.round(avgCtaMap[page] ?? 0),
      avgScrollDepth: Math.min(avgScrollDepth, 100),
      inroScenarioIds: pageScenarioIds[page] ?? [],
    };
  });

  // Totals
  const totalStats = stats.reduce(
    (acc, s) => ({
      dms: acc.dms + s.dms,
      views: acc.views + s.views,
      clicks: acc.clicks + s.clicks,
      timeSum: acc.timeSum + s.avgTimeOnPage * s.views,
      ctaTimeSum: acc.ctaTimeSum + s.avgTimeToCta * s.clicks,
      scrollDepthSum: acc.scrollDepthSum + s.avgScrollDepth * s.views,
      scroll25Sum: acc.scroll25Sum + (s.views > 0 ? s.views - Math.round(s.bounceRate * s.views / 100) : 0),
    }),
    { dms: totalDms, views: 0, clicks: 0, timeSum: 0, ctaTimeSum: 0, scrollDepthSum: 0, scroll25Sum: 0 }
  );
  const totals = {
    dms: totalStats.dms,
    views: totalStats.views,
    clicks: totalStats.clicks,
    avgTimeOnPage: totalStats.views > 0 ? Math.round(totalStats.timeSum / totalStats.views) : 0,
    bounceRate: totalStats.views > 0 ? Number((((totalStats.views - totalStats.scroll25Sum) / totalStats.views) * 100).toFixed(1)) : 0,
    avgTimeToCta: totalStats.clicks > 0 ? Math.round(totalStats.ctaTimeSum / totalStats.clicks) : 0,
    avgScrollDepth: totalStats.views > 0 ? Number((totalStats.scrollDepthSum / totalStats.views).toFixed(1)) : 0,
  };

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
        totals.dms > 0
          ? ((totals.clicks / totals.dms) * 100).toFixed(1)
          : "0",
    },
  });
}
