"use client";

import {
  BookOpen,
  Video,
  Wrench,
  LayoutTemplate,
  Users,
  Rocket,
} from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: BookOpen,
    title: "AI Courses",
    description:
      "Full video courses from beginner to advanced. Learn at your own pace with real curriculum.",
  },
  {
    icon: Video,
    title: "Weekly Live Builds",
    description:
      "Live sessions where we build together, troubleshoot, and share what's working.",
  },
  {
    icon: Wrench,
    title: "Tool Stack & Configs",
    description:
      "Curated tool lists, tested workflows, and pre-made configs. Plug in and go.",
  },
  {
    icon: LayoutTemplate,
    title: "Templates & Prompts",
    description:
      "Ready-to-deploy automations, prompt libraries, and SOPs. Copy, paste, ship.",
  },
  {
    icon: Users,
    title: "Private Community",
    description:
      "Beginners and experts in the same room, sharing wins, setups, and real-time breakthroughs.",
  },
  {
    icon: Rocket,
    title: "Project Funding",
    description:
      "Membership dues fund real AI projects from the community. Pitch your idea, get it backed.",
  },
];

export function Offer() {
  return (
    <section id="offer" className="relative py-16 sm:py-20">
      <DotPattern
        cr={1.2}
        width={24}
        height={24}
        className={cn(
          "text-white/[0.15]",
          "[mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"
        )}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300">
          What&apos;s inside
        </p>
        <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-snug tracking-tight text-white sm:text-4xl">
          Everything you need to build with AI,{" "}
          <span className="font-[family-name:var(--font-instrument-serif)] italic underline decoration-white/30 underline-offset-[6px]">
            in one place.
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
          Stop piecing it together from YouTube and Twitter threads. Here&apos;s
          what you get from day one.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <BlurFade key={item.title} delay={0.1 * i} inView className="h-full">
              <MagicCard
                className="h-full rounded-xl border border-white/10"
                gradientColor="#1a1a1a"
                gradientFrom="#333"
                gradientTo="#222"
                gradientOpacity={0.5}
              >
                <div className="p-6">
                  <item.icon className="size-5 text-neutral-300" />
                  <h3 className="mt-4 text-sm font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                    {item.description}
                  </p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
