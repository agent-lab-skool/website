"use client";

import { useEffect, useState } from "react";
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
  views: number;
  clicks: number;
  rate: string;
}

interface DailyPoint {
  date: string;
  views: number;
  clicks: number;
  ctr: number;
}

interface StatsResponse {
  range: string;
  stats: PageStat[];
  daily: DailyPoint[];
  totals: { views: number; clicks: number; rate: string };
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

export function DashboardClient() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?range=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d))
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
      {data && !loading && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <StatCard label="Total views" value={data.totals.views.toLocaleString()} />
          <StatCard label="Total clicks" value={data.totals.clicks.toLocaleString()} />
          <StatCard label="CTR" value={`${data.totals.rate}%`} />
        </div>
      )}

      {/* Chart — Views, Clicks & CTR */}
      {data && !loading && data.daily.length > 0 && (
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
                Views
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                Clicks
              </th>
              <th className="px-4 py-3 text-right font-medium text-neutral-400">
                CTR
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data && data.stats.length > 0 ? (
              data.stats.map((row) => (
                <tr
                  key={row.page}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs text-white">
                    {row.page}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {row.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {row.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-neutral-300">
                    {row.rate}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}
