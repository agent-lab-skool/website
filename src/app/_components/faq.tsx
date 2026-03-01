"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaButton } from "./cta-button";
import { CURRENT_PRICE_MO, CURRENT_TIER, NEXT_PRICE_MO } from "@/lib/constants/pricing";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What if I'm just getting started with AI?",
    a: "That's exactly when this is most valuable. The courses start from the basics and the community is full of people at every level. You'll skip months of trial and error and start building with workflows that actually work.",
  },
  {
    q: "I'm not technical, will I still get value?",
    a: "Absolutely. The courses and templates are designed to be plug-and-play. You don't need to code. If you can click, copy, and paste, you can use everything inside.",
  },
  {
    q: "What makes this different from free AI content?",
    a: "Free content tells you what's possible. Agent Lab gives you full courses, tested configs, live builds, and a community of people actually shipping. Plus, part of your membership funds real projects from members.",
  },
  {
    q: "How much time do I need to commit?",
    a: "As little or as much as you want. The live calls are ~60 minutes per week, and courses are self-paced. Most members see results within the first week.",
  },
  {
    q: "Why is this paid?",
    a: "Because the courses, live calls, resources, and community don't build themselves. The membership keeps it private, keeps the quality high, and a portion goes directly toward funding real AI projects pitched by members. You're paying for access and helping fund what gets built next.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no commitments. Cancel with one click whenever you want. No questions asked.",
  },
  {
    q: "Will the price go up?",
    a: `Yes. The price starts at ${CURRENT_PRICE_MO} for the ${CURRENT_TIER.members.toLowerCase()} members, then goes to ${NEXT_PRICE_MO}, and continues to increase as the community grows. But once you lock in your price, it stays the same forever, no matter how high it goes for new members.`,
  },
  {
    q: "Wait, was this website built with AI?",
    a: (
      <>
        Yes. Every pixel. Don&apos;t believe me?{" "}
        <a
          href="https://github.com/aflekkas/aflekkas"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="underline underline-offset-4 hover:text-white transition-colors"
        >
          Here&apos;s the entire source code
        </a>
        . Go check the commit history. And this is just the landing page. I&apos;m
        building the entire course platform with AI too. The workflows and tools I
        use to do it? That&apos;s what you learn inside Agent Lab.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300">
          FAQ
        </p>
        <h2 className="mt-6 text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Common questions
        </h2>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-white/10"
            >
              <AccordionTrigger className="text-neutral-200 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-300">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-14 text-center">
          <CtaButton />
        </div>
      </div>
    </section>
  );
}
