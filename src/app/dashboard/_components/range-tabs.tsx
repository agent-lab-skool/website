"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ranges = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "All time", value: "all" },
];

export function RangeTabs({ range }: { range: string }) {
  return (
    <Tabs value={range}>
      <TabsList className="bg-white/[0.03] border border-white/10">
        {ranges.map((r) => (
          <TabsTrigger key={r.value} value={r.value} className="text-xs" asChild>
            <Link href={`?range=${r.value}`}>{r.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
