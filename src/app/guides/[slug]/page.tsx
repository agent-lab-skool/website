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
    <>
      <h1 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
        {guide.title}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/me.jpg"
          alt="aflekkas"
          className="size-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-white">aflekkas</p>
          <p className="text-xs font-mono text-neutral-500">
            {new Date(guide.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <GuideContent guide={guide} />
    </>
  );
}
