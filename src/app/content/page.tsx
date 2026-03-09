import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Content | Agent Lab",
  description:
    "Free guides, breakdowns, and resources on building with AI agents.",
};

const content = [
  {
    tag: "Guide",
    title: "How to Build Your First AI Agent",
    description:
      "A step-by-step walkthrough for going from zero to a working AI agent using Claude and simple tooling.",
    href: "/content/first-ai-agent",
  },
  {
    tag: "Breakdown",
    title: "The AI Tool Stack I Use to Run a $50K/mo Business",
    description:
      "Every tool, every workflow, every automation. No fluff, just what actually works.",
    href: "/content/ai-tool-stack",
  },
  {
    tag: "Playbook",
    title: "Automating Content Creation with AI",
    description:
      "How to go from idea to published content across platforms without a team.",
    href: "/content/automating-content",
  },
  {
    tag: "Guide",
    title: "AI Agents for Sales and Outreach",
    description:
      "Build agents that handle prospecting, personalization, and follow-ups while you sleep.",
    href: "/content/ai-sales-agents",
  },
  {
    tag: "Breakdown",
    title: "Why Most AI Automations Break (And How to Fix Them)",
    description:
      "Common failure modes in AI workflows and the patterns that actually hold up in production.",
    href: "/content/ai-automation-failures",
  },
  {
    tag: "Playbook",
    title: "From Idea to MVP in a Weekend with AI",
    description:
      "The exact process for using AI to ship a working product in 48 hours.",
    href: "/content/idea-to-mvp",
  },
];

export default function ContentPage() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-x-hidden bg-background">
        <DotPattern
          cr={1.2}
          width={24}
          height={24}
          className={cn(
            "text-white/[0.15]",
            "[mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]"
          )}
        />
        <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-24 sm:pt-32">
          {/* Header */}
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            &larr; Home
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-neutral-300">
            Resources
          </p>
          <h1 className="mt-6 text-3xl font-medium leading-snug tracking-tight text-white sm:text-4xl md:text-5xl">
            Free guides and{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic">
              breakdowns
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
            Everything we publish for free. Tactical, no-fluff content on
            building and scaling with AI.
          </p>

          {/* Content grid */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {content.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500">
                    {item.tag}
                  </span>
                  <h2 className="mt-3 text-base font-medium leading-snug text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-300 transition-colors group-hover:text-white">
                  Read
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
