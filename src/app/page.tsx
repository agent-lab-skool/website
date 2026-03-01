import type { Metadata } from "next";

import { About } from "./_components/about";
import { Faq } from "./_components/faq";
import { Hero } from "./_components/hero";
import { Offer } from "./_components/offer";
import { PricingCta } from "./_components/pricing-cta";
import { Problem } from "./_components/problem";
import { Testimonials } from "./_components/testimonials";
import { CURRENT_PRICE_MO } from "@/lib/constants/pricing";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Agent Lab | A Private AI Community for Builders",
  description: `The private AI community for builders who want to move faster, build smarter, and stay ahead. ${CURRENT_PRICE_MO}.`,
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-x-hidden bg-background">
        <DotPattern
          cr={1.2}
          width={24}
          height={24}
          className={cn(
            "text-white/[0.15]",
            "[mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_70%)]",
          )}
        />
        <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />
        <Hero />
        <Problem />
      </div>
      <Offer />
      <About />
      <Testimonials />
      <PricingCta />
      <Faq />
    </main>
  );
}
