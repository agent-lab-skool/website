"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Copy, Check } from "lucide-react";
import type { Guide, GuideBlock, GuideSection } from "../_lib/guides";
import { SubtleCta, MidCta, BottomCta, FinalCta } from "./guide-cta";
import { ScrollCta } from "./scroll-cta";
import { cn } from "@/lib/utils";

function CodeBlock({ content, language }: { content: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group/code my-4 overflow-hidden rounded-lg border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-1.5">
        <span className="text-xs font-mono text-neutral-500">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-white/[0.02] p-4 text-sm leading-relaxed">
        <code className="font-mono text-neutral-300">{content}</code>
      </pre>
    </div>
  );
}

function ProTip({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-3 text-left text-sm font-medium text-neutral-200 transition-colors hover:text-white"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-neutral-500 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
        {title}
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pl-6 text-sm leading-relaxed text-neutral-400">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: GuideBlock, i: number) {
  switch (block.type) {
    case "text":
      return (
        <p key={i} className="my-3 text-sm leading-relaxed text-neutral-300">
          {block.content}
        </p>
      );
    case "code":
      return <CodeBlock key={i} content={block.content!} language={block.language} />;
    case "heading3":
      return (
        <h3 key={i} className="mt-8 mb-3 text-base font-medium text-white">
          {block.content}
        </h3>
      );
    case "bullet":
      return (
        <ul key={i} className="my-4 space-y-2 pl-5">
          {block.items?.map((item, j) => (
            <li key={j} className="list-disc text-sm leading-relaxed text-neutral-300">
              {item}
            </li>
          ))}
        </ul>
      );
    case "link":
      return (
        <p key={i} className="my-2">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-400 underline underline-offset-2 transition-colors hover:text-white"
          >
            {block.text} ↗
          </a>
        </p>
      );
    case "image":
      return (
        <figure key={i} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.caption || ""}
            className="w-full rounded-lg border border-white/10"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-neutral-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

function renderSection(section: GuideSection) {
  return (
    <div>
      <h2 className="mt-12 mb-4 text-xl font-medium tracking-tight text-white">
        {section.emoji && <span className="mr-2">{section.emoji}</span>}
        {section.heading}
      </h2>
      {section.blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Used the AI tool stack to ship a full MVP in a weekend. Would've taken me weeks without it.",
    name: "Ashwin Balaraman",
    role: "AI Developer & Founder",
    image: "/landing/testimonials/ashwin.jpeg",
  },
  {
    quote:
      "Built my own ClawdBot using just Claude Code and saved hundreds of $. This community really does teach you how to harness AI.",
    name: "Nathan Lee",
    role: "AI Tinkerer & CS Student",
    image: "/landing/testimonials/nathan.jpeg",
  },
  {
    quote:
      "Bro the content workflow you dropped last week is stupid good. Set it up for our creators and it cut our turnaround in half.",
    name: "Sonny Morse",
    role: "UGC Marketing Agency Owner",
    image: "/landing/testimonials/sonny.jpeg",
  },
  {
    quote:
      "Actually wild how much people share in here. Most paid groups are dead after a week, this one keeps delivering.",
    name: "Davin Patel",
    role: "Partner, VantagePoint",
    image: "/landing/testimonials/davin.jpeg",
  },
  {
    quote:
      "Knew how to vibe code in Cursor but Claude Code took it to another level. Landed an internship at a YC company off what I built.",
    name: "Tim Yu",
    role: "Student @ UChicago",
    image: "/landing/testimonials/tim.jpeg",
  },
  {
    quote:
      "Built my own website for luxury watch sourcing, then landed my first web building client within a week for $1.2K. Insane ROI.",
    name: "Henry Ohler",
    role: "Entrepreneur & Watch Dealer",
    image: "/landing/testimonials/henry.jpeg",
  },
  {
    quote:
      "Was waiting on developers for ages to build ClubLinked. Totally non-technical, but I built and shipped it myself. Saved months and thousands in dev costs.",
    name: "Eleftherios Ntrigkogias",
    role: "Founder, ClubLinked",
    image: "/landing/testimonials/eleftherios.jpg",
  },
  {
    quote:
      "Used to spend 5 hours on a landing page in Framer. Now I build them in 30 minutes. Been closing thousands in clients every month.",
    name: "Jackson Gerner",
    role: "Growth Operator & VSLs",
    image: "/landing/testimonials/jackson.jpg",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
  image,
}: {
  quote: string;
  name: string;
  role: string;
  image: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-sm leading-relaxed text-neutral-300">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="size-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  return (
    <div className="mt-12">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
        What people are saying
      </p>
      <h2 className="mt-3 text-xl font-medium tracking-tight text-white">
        Don&apos;t just take my word for it.
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}

export function GuideContent({ guide }: { guide: Guide }) {
  const searchParams = useSearchParams();
  const hideCta = searchParams.get("hideCTA") === "true";
  const midPoint = Math.floor(guide.sections.length / 2);

  return (
    <article>
      {/* Intro */}
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {guide.intro}
      </p>

      <div className="mt-8 h-px bg-white/10" />

      {/* Sections with CTAs inserted */}
      {guide.sections.map((section, i) => (
        <div key={i}>
          {renderSection(section)}
          {!hideCta && i === 0 && <SubtleCta />}
          {!hideCta && i === midPoint && i !== 0 && <MidCta />}
        </div>
      ))}

      {/* Example section */}
      {guide.example && (
        <>
          <div className="mt-10 h-px bg-white/10" />
          {renderSection(guide.example)}
        </>
      )}

      {/* Mid CTA if only 1-2 sections */}
      {!hideCta && guide.sections.length <= 2 && <MidCta />}

      {/* Pro Tips */}
      {guide.proTips && guide.proTips.length > 0 && (
        <>
          <div className="mt-10 h-px bg-white/10" />
          <h2 className="mt-12 mb-4 text-xl font-medium tracking-tight text-white">
            💡 Pro Tips
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5">
            {guide.proTips.map((tip, i) => (
              <ProTip key={i} title={tip.title} body={tip.body} />
            ))}
          </div>
        </>
      )}

      {/* Bottom CTA with testimonials as proof */}
      {!hideCta && (
        <>
          <div className="mt-10 h-px bg-white/10" />
          <BottomCta />
          <FinalCta />
          <TestimonialsSection />
          <FinalCta />
        </>
      )}
      {!hideCta && <ScrollCta />}
    </article>
  );
}
