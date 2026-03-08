import type { Metadata } from "next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getAllGuides } from "./_lib/guides";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Guides | aflekkas",
  description:
    "Free guides on Claude Code, AI agents, and building with AI. Real configs, real code, zero fluff.",
};

export default function GuidesIndex() {
  const guides = getAllGuides();

  return (
    <main className="min-h-screen">
      <div className="relative overflow-x-hidden bg-background">
        <DotPattern
          cr={1.2}
          width={24}
          height={24}
          className={cn(
            "text-white/[0.15]",
            "[mask-image:radial-gradient(ellipse_at_top,white_10%,transparent_50%)]"
          )}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-12 pb-20">
          <a
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
            home
          </a>

          <p className="mt-8 text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            Free guides
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Real configs, real code, zero fluff.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            Everything I use to build with Claude Code, AI agents, and
            automation. No gatekeeping.
          </p>

          <div className="mt-12 space-y-4">
            {guides.map((guide) => (
              <a
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group block rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-medium text-white group-hover:underline group-hover:underline-offset-2">
                      {guide.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-neutral-400">
                      {guide.description}
                    </p>
                    <p className="mt-3 text-xs font-mono text-neutral-600">
                      {new Date(guide.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
              </a>
            ))}

            {guides.length === 0 && (
              <p className="text-sm text-neutral-500">
                No guides yet. Check back soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
