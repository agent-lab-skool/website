"use client";

import { DotPattern } from "@/components/ui/dot-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import { CtaButton } from "./cta-button";
import { PRICE_TIERS, CURRENT_TIER } from "@/lib/constants/pricing";
import {
  BookOpen,
  Video,
  LayoutTemplate,
  Users,
  Rocket,
} from "lucide-react";

const perks = [
  { icon: BookOpen, label: "Full course library & future drops" },
  { icon: Video, label: "Weekly live builds & recordings" },
  { icon: LayoutTemplate, label: "All configs, templates & prompt libraries" },
  { icon: Users, label: "Private community access" },
  { icon: Rocket, label: "Your dues help fund member projects" },
];

export function PricingCta() {
  return (
    <section className="relative py-16 sm:py-20">
      <DotPattern
        cr={1.2}
        width={24}
        height={24}
        className={cn(
          "text-white/[0.15]",
          "[mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"
        )}
      />

      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
          Agent Lab
        </p>

        {/* Pricing card */}
        <MagicCard
          className="mt-10 overflow-hidden rounded-2xl"
          gradientSize={250}
          gradientColor="#1a1a1a"
          gradientOpacity={0.9}
          gradientFrom="#ffffff"
          gradientTo="#666666"
        >
          <div className="relative rounded-2xl px-8 pb-12 pt-14 sm:px-12 sm:pb-14 sm:pt-16">
            {/* Price */}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-semibold text-white sm:text-6xl">
                ${CURRENT_TIER.price}
              </span>
              <span className="text-sm font-medium text-neutral-500">
                /mo
              </span>
            </div>

            {/* Perks */}
            <ul className="mt-10 space-y-4.5">
              {perks.map((perk) => (
                <li key={perk.label} className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                    <perk.icon className="size-3.5 text-neutral-400" />
                  </div>
                  <span className="text-[13px] text-neutral-300">{perk.label}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-12">
              <CtaButton className="w-full" />
              <p className="mt-4 text-center text-[11px] text-neutral-600">
                Cancel anytime. No questions asked.
              </p>
            </div>
          </div>
        </MagicCard>
      </div>

      {/* Price Roadmap */}
      <div className="relative z-10 mx-auto mt-16 max-w-md px-6 text-center">
        <p className="mb-6 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
          Price increases as we grow
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRICE_TIERS.map((tier) => (
            <div
              key={tier.members}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                tier.active
                  ? "border-white/20 bg-white/[0.06] text-white"
                  : "border-white/[0.06] text-neutral-600"
              )}
            >
              ${tier.price}/mo
              <span className="ml-1.5 text-[10px] opacity-60">
                {tier.members}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-neutral-600">
          Lock in your price today. It stays the same forever.
        </p>
      </div>
    </section>
  );
}
