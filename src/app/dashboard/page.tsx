import type { Metadata } from "next";
import { DashboardClient } from "./_components/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | aflekkas",
  robots: "noindex, nofollow",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight text-white">
        Analytics
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Page views and CTA click-through rates.
      </p>
      <DashboardClient />
    </div>
  );
}
