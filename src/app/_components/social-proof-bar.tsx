"use client";

import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { value: 50, prefix: "$", suffix: "K+/mo", label: "Revenue built with AI" },
  { value: 2, suffix: "M+", label: "Monthly views" },
  { value: 1000, suffix: "+", label: "Community members" },
  { value: 100, suffix: "%", label: "AI-built" },
];

export function SocialProofBar() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 py-10 sm:py-12 md:grid-cols-4 md:gap-0">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {stat.prefix}
              <NumberTicker value={stat.value} delay={0.3} />
              {stat.suffix}
            </p>
            <p className="mt-1 text-xs text-neutral-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
