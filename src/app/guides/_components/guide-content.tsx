"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Guide, GuideBlock, GuideSection } from "../_lib/guides";
import { SubtleCta, MidCta, BottomCta } from "./guide-cta";
import { cn } from "@/lib/utils";

function CodeBlock({ content, language }: { content: string; language?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-white/10">
      {language && (
        <div className="border-b border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-mono text-neutral-500">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto bg-white/[0.02] p-4 text-sm leading-relaxed">
        <code className="font-mono text-neutral-300">{content}</code>
      </pre>
    </div>
  );
}

function ProTip({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 py-3 text-left text-sm font-medium text-neutral-200 transition-colors hover:text-white"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-neutral-500 transition-transform",
            open && "rotate-180"
          )}
        />
        {title}
      </button>
      {open && (
        <p className="pb-4 pl-6 text-sm leading-relaxed text-neutral-400">
          {body}
        </p>
      )}
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={block.url}
          alt=""
          className="my-4 w-full rounded-lg border border-white/10"
        />
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

export function GuideContent({ guide }: { guide: Guide }) {
  const midPoint = Math.floor(guide.sections.length / 2);

  return (
    <article className="mx-auto max-w-2xl px-6 pb-20">
      {/* Intro */}
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">
        {guide.intro}
      </p>

      <div className="mt-8 h-px bg-white/10" />

      {/* Sections with CTAs inserted */}
      {guide.sections.map((section, i) => (
        <div key={i}>
          {renderSection(section)}
          {i === 0 && <SubtleCta />}
          {i === midPoint && i !== 0 && <MidCta />}
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
      {guide.sections.length <= 2 && <MidCta />}

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

      {/* Bottom CTA */}
      <div className="mt-10 h-px bg-white/10" />
      <BottomCta />
    </article>
  );
}
