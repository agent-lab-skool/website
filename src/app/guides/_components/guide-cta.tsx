"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { SKOOL_URL } from "@/lib/constants/links";
import { trackCta } from "@/components/tracker";

export function SubtleCta() {
  const pathname = usePathname();
  return (
    <p className="my-8 text-sm text-neutral-500">
      This guide covers the setup, but the{" "}
      <a
        href={SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
        onClick={() => {
          track("guide_cta_click", { type: "subtle" });
          trackCta(pathname);
        }}
      >
        full video course
      </a>
      {" "}walks through a real build from scratch, with templates you can clone.
    </p>
  );
}

export function MidCta() {
  const pathname = usePathname();
  return (
    <div className="relative my-12 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
      <p className="text-sm leading-relaxed text-neutral-300">
        Want to see this built from zero to deployed?{" "}
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2"
          onClick={() => {
            track("guide_cta_click", { type: "mid" });
            trackCta(pathname);
          }}
        >
          The full course
        </a>
        {" "}includes video walkthroughs, starter templates, and the exact prompts I use.
      </p>
      <BorderBeam duration={8} size={100} colorFrom="#ffffff" colorTo="#666666" />
    </div>
  );
}

export function BottomCta() {
  return (
    <div className="mt-16 mb-4">
      <h2 className="text-2xl font-medium tracking-tight text-white">
        AI is moving fast. Most people are watching.
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
        The builders who learn these tools now are the ones who won&apos;t get
        left behind. The course covers everything in this guide and more:
        video walkthroughs, real project builds, starter templates, and the
        exact prompts and configs I use every day.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/landing/courses.png"
        alt="Agent Lab courses"
        className="mt-6 w-full rounded-xl border border-white/10"
      />
    </div>
  );
}

export function FinalCta() {
  const pathname = usePathname();
  return (
    <div className="mt-10 mb-8 flex justify-center">
      <RainbowButton asChild size="lg">
        <a
          href={SKOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn"
          onClick={() => {
            track("guide_cta_click", { type: "bottom" });
            trackCta(pathname);
          }}
        >
          Watch the full course
          <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </a>
      </RainbowButton>
    </div>
  );
}
