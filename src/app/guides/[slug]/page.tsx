import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGuides, getGuide } from "../_lib/guides";
import { GuideContent } from "../_components/guide-content";



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
        {/* Header */}
        <div className="relative z-10 mx-auto max-w-2xl px-6 pt-12 pb-4">
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
