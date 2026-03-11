"use client";

import React, { useEffect, useState } from "react";
import {
  Send,
  Eye,
  MousePointerClick,
  ArrowRight,
  Clock,
  TrendingDown,
  Timer,
  GalleryVerticalEnd,
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
      <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-3 text-left font-medium text-neutral-400">
                Page
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                DMs
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Views
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Skool clicks
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                <span className="flex items-center justify-end gap-1">DM <ArrowRight className="size-3" /> Click</span>
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Avg. time
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Bounce
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Time to CTA
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.stats && data.stats.length > 0 ? (
              data.stats.map((row) => (
                <tr
                  key={row.page}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <a
                      href={row.page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline decoration-white/20 underline-offset-4 hover:decoration-white/60 transition-colors"
                    >
                      {row.page}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {(row.dms ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {(row.views ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {(row.clicks ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {row.rate}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {formatTime(row.avgTimeOnPage ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {row.bounceRate ?? 0}%
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {formatTime(row.avgTimeToCta ?? 0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  No data yet. Views will appear as traffic comes in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
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
