"use client";

import { BlurFade } from "@/components/ui/blur-fade";

const painPoints = [
  "You see AI announcements daily but don't know which ones actually matter for your business.",
  "You've spent hours on tutorials, tools, and setups that went nowhere. Meanwhile, the people actually shipping are using workflows you haven't seen yet.",
  "Every week you spend figuring it out alone is a week someone else pulls ahead. The gap compounds fast.",
];

export function Problem() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300">
          The problem
        </p>

        <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-snug tracking-tight text-white sm:text-4xl">
          AI is moving fast. You need{" "}
          <span className="font-[family-name:var(--font-instrument-serif)] italic underline decoration-white/30 underline-offset-[6px]">
            the right people to keep up.
          </span>
        </h2>

        <div className="mt-12 space-y-6">
          {painPoints.map((point, i) => (
            <BlurFade key={i} delay={0.15 * i} inView>
              <p className="max-w-xl text-base leading-relaxed text-neutral-300">
                {point}
              </p>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
