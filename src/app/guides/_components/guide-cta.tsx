"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SKOOL_URL } from "@/lib/constants/links";

export function SubtleCta() {
  return (
    <p className="my-8 text-sm text-neutral-500">
      I share all my configs and project setups inside{" "}
      <a
        href={SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
        onClick={() => track("guide_cta_click", { type: "subtle" })}
      >
        Agent Lab
      </a>{" "}
      if you want the full setup files.
    </p>
  );
}

export function MidCta() {
  return (
    <div className="my-12 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
      <p className="text-sm leading-relaxed text-neutral-300">
        I go deeper on this setup (and a bunch of other Claude Code workflows) inside{" "}
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2"
          onClick={() => track("guide_cta_click", { type: "mid" })}
        >
          Agent Lab
        </a>
        . If you want to see the exact configs I use and how I structure projects for
        this, it&apos;s all in there.
      </p>
    </div>
  );
}

export function BottomCta() {
  return (
    <div className="mt-16 mb-8">
      <h2 className="text-2xl font-medium tracking-tight text-white">
        Keep building?
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        You&apos;ve got the configs and the workflow. If you want to go further
        and see full project breakdowns, advanced Claude Code setups, and the
        agent configurations I use for real client work, that&apos;s what the
        courses are for.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://i.imgur.com/gxarE2c.png"
        alt="Agent Lab courses"
        className="mt-6 w-full max-w-lg rounded-xl border border-white/10"
      />
      <div className="mt-6">
        <RainbowButton asChild size="lg">
          <a
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn"
            onClick={() => track("guide_cta_click", { type: "bottom" })}
          >
            Join Agent Lab
            <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </a>
        </RainbowButton>
      </div>
    </div>
  );
}
