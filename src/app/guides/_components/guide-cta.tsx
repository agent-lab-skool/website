"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SKOOL_URL } from "@/lib/constants/links";

export function SubtleCta() {
  return (
    <p className="my-8 text-sm text-neutral-500">
      I go way deeper on this in a{" "}
      <a
        href={SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
        onClick={() => track("guide_cta_click", { type: "subtle" })}
      >
        free video course
      </a>{" "}
      — it covers the full setup step by step.
    </p>
  );
}

export function MidCta() {
  return (
    <div className="my-12 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
      <p className="text-sm leading-relaxed text-neutral-300">
        There&apos;s a{" "}
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2"
          onClick={() => track("guide_cta_click", { type: "mid" })}
        >
          full video walkthrough
        </a>
        {" "}of this exact workflow if you want to see it in action.
      </p>
    </div>
  );
}

export function BottomCta() {
  return (
    <div className="mt-16 mb-4">
      <h2 className="text-2xl font-medium tracking-tight text-white">
        Want the full course?
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        I made a complete video course that walks through everything in this
        guide and more. Real builds, real configs, no fluff.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://i.imgur.com/gxarE2c.png"
        alt="Agent Lab courses"
        className="mt-6 w-full max-w-lg rounded-xl border border-white/10"
      />
    </div>
  );
}

export function FinalCta() {
  return (
    <div className="mt-10 mb-8">
      <RainbowButton asChild size="lg">
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn"
          onClick={() => track("guide_cta_click", { type: "bottom" })}
        >
          Watch the free course
          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </a>
      </RainbowButton>
    </div>
  );
}
