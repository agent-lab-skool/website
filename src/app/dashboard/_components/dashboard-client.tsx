"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Send,
  Eye,
  MousePointerClick,
  ArrowRight,
  Clock,
  TrendingDown,
  Timer,
  GalleryVerticalEnd,
  Zap,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface PageStat {
  page: string;
  dms: number;
  views: number;
  clicks: number;
  rate: string;
  avgTimeOnPage: number;
  bounceRate: number;
  avgTimeToCta: number;
  avgScrollDepth: number;
  inroScenarioIds: number[];
}

interface DailyPoint {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
}

interface Totals {
  dms: number;
  views: number;
  clicks: number;
  rate: string;
  avgTimeOnPage: number;
  bounceRate: number;
  avgTimeToCta: number;
  avgScrollDepth: number;
}

interface StatsResponse {
  range: string;
  stats: PageStat[];
  daily: DailyPoint[];
  totals: Totals;
}

const ranges = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "All time", value: "all" },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function DashboardClient() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?range=${range}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="mt-8">
      {/* Range selector */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 w-fit">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              range === r.value
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Totals */}
      {data?.totals && !loading && (
        <>
          <div className="mt-6 grid grid-cols-4 gap-4">
            <StatCard icon={Send} label="DMs sent (lifetime)" value={(data.totals.dms ?? 0).toLocaleString()} />
            <StatCard icon={Eye} label="Page views" value={(data.totals.views ?? 0).toLocaleString()} />
            <StatCard icon={MousePointerClick} label="Skool clicks" value={(data.totals.clicks ?? 0).toLocaleString()} />
            <StatCard icon={ArrowRight} label="DM → Click" value={`${data.totals.rate ?? 0}%`} />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            <StatCard icon={Clock} label="Avg. time on page" value={formatTime(data.totals.avgTimeOnPage ?? 0)} />
            <StatCard icon={TrendingDown} label="Bounce rate" value={`${data.totals.bounceRate ?? 0}%`} />
            <StatCard icon={Timer} label="Avg. time to CTA" value={formatTime(data.totals.avgTimeToCta ?? 0)} />
            <StatCard icon={GalleryVerticalEnd} label="Avg. scroll depth" value={`${data.totals.avgScrollDepth ?? 0}%`} />
          </div>
        </>
      )}

      {/* Chart — Views, Clicks & CTR */}
      {data?.daily && !loading && data.daily.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-4 text-sm font-medium text-neutral-400">
            Daily overview
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: "#737373", fontSize: 11 }}
                axisLine={{ stroke: "#ffffff10" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#737373", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#737373", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  background: "#171717",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(v) => formatDate(String(v))}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#737373" }}
              />
              <Bar yAxisId="left" dataKey="views" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="left" dataKey="clicks" fill="#a855f7" radius={[3, 3, 0, 0]} />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="ctr"
                name="CTR %"
                stroke="#22c55e"
                fill="#22c55e15"
                strokeWidth={1.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full text-sm" style={{ minWidth: 860 }}>
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap w-[60px]">
                  <ColHeader icon={Zap} label="" />
                </th>
                <th className="px-5 py-3.5 text-left font-medium text-neutral-500 w-[280px]">
                  <ColHeader icon={null} label="Page" />
                </th>
                {/* Funnel group */}
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={Send} label="DMs" />
                </th>
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={Eye} label="Views" />
                </th>
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={MousePointerClick} label="Clicks" />
                </th>
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap border-r border-white/[0.06]">
                  <span className="flex items-center justify-end gap-1">
                    <Send className="size-3 shrink-0" />
                    <ArrowRight className="size-3 shrink-0" />
                    <MousePointerClick className="size-3 shrink-0" />
                  </span>
                </th>
                {/* Engagement group */}
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={Clock} label="Avg. time" />
                </th>
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={TrendingDown} label="Bounce" />
                </th>
                <th className="px-5 py-3.5 text-right font-medium text-neutral-500 whitespace-nowrap">
                  <ColHeader icon={Timer} label="→ CTA" />
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-neutral-500">
                    Loading...
                  </td>
                </tr>
              ) : data?.stats && data.stats.length > 0 ? (
                data.stats.map((row) => (
                  <tr key={row.page} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-right">
                      <AutomationsCell ids={row.inroScenarioIds ?? []} />
                    </td>
                    <td className="px-5 py-4 max-w-[280px]">
                      <a
                        href={row.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-neutral-300 underline decoration-white/10 underline-offset-4 hover:text-white hover:decoration-white/40 transition-colors truncate block"
                      >
                        {row.page}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {(row.dms ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {(row.views ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {(row.clicks ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums whitespace-nowrap border-r border-white/[0.06]">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium tabular-nums ${
                        Number(row.rate) >= 10 ? "bg-white/10 text-white" :
                        Number(row.rate) >= 5  ? "bg-white/[0.06] text-neutral-200" :
                                                  "text-neutral-500"
                      }`}>
                        {row.rate}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {formatTime(row.avgTimeOnPage ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {row.bounceRate ?? 0}%
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-neutral-300 whitespace-nowrap">
                      {formatTime(row.avgTimeToCta ?? 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-neutral-500">
                    No data yet. Views will appear as traffic comes in.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const INRO_BASE = "https://app.inro.social/scenarios";

function AutomationsCell({ ids }: { ids: number[] }) {
  if (ids.length === 0) {
    return <span className="text-xs text-neutral-600">—</span>;
  }
  return (
    <div className="group/auto relative inline-block">
      <button className="flex items-center gap-1 text-xs tabular-nums text-neutral-400 hover:text-white transition-colors">
        <Zap className="size-3" />
        <span>{ids.length}</span>
      </button>
      {/* Popover */}
      <div className="pointer-events-none group-hover/auto:pointer-events-auto opacity-0 group-hover/auto:opacity-100 transition-opacity duration-150 absolute right-0 bottom-full mb-2 z-50 w-52 rounded-lg border border-white/10 bg-neutral-950 shadow-xl p-2">
        <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
          Automations
        </p>
        {ids.map((id) => (
          <a
            key={id}
            href={`${INRO_BASE}/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <span className="font-mono">#{id}</span>
            <ExternalLink className="size-3 shrink-0 text-neutral-600" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ColHeader({ icon: Icon, label }: { icon: React.ElementType | null; label: string }) {
  return (
    <span className="inline-flex items-center justify-end gap-1.5">
      {Icon && <Icon className="size-3 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3 text-neutral-500" />
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-medium tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}
