"use client";

import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SKOOL_URL } from "@/lib/constants/links";
import { cn } from "@/lib/utils";

export function CtaButton({ className }: { className?: string }) {
  return (
    <RainbowButton asChild size="lg" className={cn(className)}>
      <a
        href={SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group/btn"
        onClick={() => track("cta_click", { destination: "skool" })}
      >
        Join Agent Lab
        <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
      </a>
    </RainbowButton>
  );
}
