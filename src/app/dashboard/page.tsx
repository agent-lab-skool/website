import type { Metadata } from "next";
import { fetchStats } from "./_lib/fetch-stats";
import { DashboardContent } from "./_components/dashboard-client";
import { RangeTabs } from "./_components/range-tabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | aflekkas",
  robots: "noindex, nofollow",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range = "7d" } = await searchParams;
  const data = await fetchStats(range);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight text-white">
        Analytics
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Page views and CTA click-through rates.
      </p>

      <div className="mt-8">
        <RangeTabs range={range} />
        <DashboardContent data={data} />
      </div>
    </div>
  );
}
