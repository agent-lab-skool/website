import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllGuides, getGuide } from "../_lib/guides";
import { GuideContent } from "../_components/guide-content";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | aflekkas`,
    description: guide.description,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

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

        {/* Header */}
        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-12 pb-4">
          <a
            href="/guides"
            className="group inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
            all guides
          </a>

          <h1 className="mt-6 text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
            {guide.title}
          </h1>

          <p className="mt-3 text-xs font-mono text-neutral-500">
            {new Date(guide.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <GuideContent guide={guide} />
      </div>
    </main>
  );
}
