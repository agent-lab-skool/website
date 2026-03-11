"use client";

import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
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
  CalendarDays,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
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
  date?: string | null;
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

export interface StatsData {
  range: string;
  stats: PageStat[];
  daily: DailyPoint[];
  totals: Totals;
}

type SortKey = "date" | "page" | "dms" | "views" | "clicks" | "rate" | "avgTimeOnPage" | "bounceRate" | "avgTimeToCta";
type SortDir = "asc" | "desc";

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

function sortStats(stats: PageStat[], key: SortKey, dir: SortDir): PageStat[] {
  return [...stats].sort((a, b) => {
    let av: string | number = 0;
    let bv: string | number = 0;

    if (key === "date") {
      av = a.date ?? "";
      bv = b.date ?? "";
      // nulls last
      if (!av && !bv) return 0;
      if (!av) return 1;
      if (!bv) return -1;
    } else if (key === "page") {
      av = a.page;
      bv = b.page;
    } else if (key === "rate") {
      av = Number(a.rate);
      bv = Number(b.rate);
    } else {
      av = (a[key] as number) ?? 0;
      bv = (b[key] as number) ?? 0;
    }

    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

export function DashboardContent({ data }: { data: StatsData }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sortedStats = sortStats(data.stats, sortKey, sortDir);

  return (
    <div>
      {/* Totals */}
      {data.totals && (
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
      {data.daily.length > 0 && (
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
          <table className="w-full text-sm" style={{ minWidth: 960 }}>
            <TableHeader className="[&_tr]:border-white/10">
              <TableRow className="border-white/10 bg-white/[0.03] hover:bg-white/[0.03]">
                {/* Identity group */}
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={CalendarDays} label="Updated" sortKey="date" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={Zap} label="Automations" sortKey="date" currentSort={null} currentDir={sortDir} onSort={() => {}} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500 w-[260px] border-r border-white/[0.06]">
                  <ColHeader icon={null} label="Page" sortKey="page" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                {/* Funnel group */}
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={Send} label="DMs" sortKey="dms" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={Eye} label="Views" sortKey="views" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={MousePointerClick} label="Clicks" sortKey="clicks" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500 border-r border-white/[0.06]">
                  <ColHeader
                    icon={null}
                    label=""
                    sortKey="rate"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    customLabel={
                      <span className="flex items-center justify-start gap-1">
                        <Send className="size-3 shrink-0" />
                        <ArrowRight className="size-3 shrink-0" />
                        <MousePointerClick className="size-3 shrink-0" />
                      </span>
                    }
                  />
                </TableHead>
                {/* Engagement group */}
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={Clock} label="Avg. time" sortKey="avgTimeOnPage" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={TrendingDown} label="Bounce" sortKey="bounceRate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
                <TableHead className="px-5 py-3.5 text-left font-medium text-neutral-500">
                  <ColHeader icon={Timer} label="→ CTA" sortKey="avgTimeToCta" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.length > 0 ? (
                sortedStats.map((row) => (
                  <TableRow key={row.page} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-500 text-xs">
                      {row.date ? formatDate(row.date) : <span className="text-neutral-700">—</span>}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <AutomationsCell ids={row.inroScenarioIds ?? []} />
                    </TableCell>
                    <TableCell className="px-5 py-4 max-w-[260px] border-r border-white/[0.06]">
                      <a
                        href={row.page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-neutral-300 underline decoration-white/10 underline-offset-4 hover:text-white hover:decoration-white/40 transition-colors truncate block"
                      >
                        {row.page}
                      </a>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {(row.dms ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {(row.views ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {(row.clicks ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300 border-r border-white/[0.06]">
                      {row.rate}%
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {formatTime(row.avgTimeOnPage ?? 0)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {row.bounceRate ?? 0}%
                    </TableCell>
                    <TableCell className="px-5 py-4 text-left tabular-nums text-neutral-300">
                      {formatTime(row.avgTimeToCta ?? 0)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="px-5 py-10 text-center text-neutral-500">
                    No data yet. Views will appear as traffic comes in.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

const INRO_BASE = "https://app.inro.social/public/scenarios";

function AutomationsCell({ ids }: { ids: number[] }) {
  if (ids.length === 0) {
    return <span className="text-xs text-neutral-600">—</span>;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 text-xs tabular-nums text-neutral-400 hover:text-white transition-colors">
          <Zap className="size-3" />
          <span>{ids.length}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2 bg-neutral-950 border-white/10">
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
      </PopoverContent>
    </Popover>
  );
}

function ColHeader({
  icon: Icon,
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  align = "left",
  customLabel,
}: {
  icon: React.ElementType | null;
  label: string;
  sortKey: SortKey;
  currentSort: SortKey | null;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
  customLabel?: React.ReactNode;
}) {
  const isActive = currentSort === sortKey;
  const isClickable = currentSort !== null;

  const SortIcon = isActive
    ? currentDir === "asc" ? ChevronUp : ChevronDown
    : ChevronsUpDown;

  const content = (
    <span className={`inline-flex items-center gap-1.5 ${align === "left" ? "justify-start" : "justify-end"}`}>
      {Icon && <Icon className="size-3 shrink-0" />}
      {customLabel ?? (label && <span>{label}</span>)}
      {isClickable && (
        <SortIcon className={`size-3 shrink-0 transition-colors ${isActive ? "text-neutral-300" : "text-neutral-600"}`} />
      )}
    </span>
  );

  if (!isClickable) return content;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1.5 cursor-pointer select-none transition-colors hover:text-neutral-200 ${
        isActive ? "text-neutral-300" : ""
      } ${align === "left" ? "justify-start" : "justify-end w-full"}`}
    >
      {Icon && <Icon className="size-3 shrink-0" />}
      {customLabel ?? (label && <span>{label}</span>)}
      <SortIcon className={`size-3 shrink-0 transition-colors ${isActive ? "text-neutral-300" : "text-neutral-600"}`} />
    </button>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card className="gap-0 border-white/10 bg-white/[0.03] px-4 py-4 shadow-none">
      <div className="flex items-center gap-1.5">
        <Icon className="size-3 text-neutral-500" />
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-medium tabular-nums text-white">
        {value}
      </p>
    </Card>
  );
}
