"use client";

import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";

import { BlurFade } from "@/components/ui/blur-fade";

export function About() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-300">
          Who&apos;s behind this
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-[200px_1fr] md:items-start">
          {/* Avatar placeholder */}
          <BlurFade delay={0} inView>
            <Image
              src="/me.jpg"
              alt="@aflekkas"
              width={176}
              height={176}
              className="mx-auto size-44 rounded-2xl border border-white/10 object-cover md:mx-0"
            />
            <div className="mt-3 flex items-center justify-center gap-3 md:justify-start">
              <a
                href="https://www.instagram.com/aflekkas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.tiktok.com/@aflekkas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/alexandros-lekkas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-white"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </BlurFade>

          {/* Story */}
          <div className="space-y-5">
            <BlurFade delay={0.1} inView>
              <p className="text-base leading-relaxed text-neutral-300">
                I&apos;m <span className="text-white">@aflekkas</span>, a
                founder who built a company doing{" "}
                <a
                    href="https://mediamaxxing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 hover:text-neutral-200"
                  >
                    above 6 figures in revenue a month
                  </a>
                , gaining millions of views every month.
              </p>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <p className="text-base leading-relaxed text-neutral-300">
                I treated AI as a co-founder, not a toy. That&apos;s how I went from
                zero to 2M+ monthly views and a profitable business. Every
                workflow, every piece of content, every system was built with
                the tools and strategies I now share inside Agent Lab.
              </p>
            </BlurFade>

            <BlurFade delay={0.3} inView>
              <p className="text-base leading-relaxed text-neutral-300">
                When I started, I wasted months stitching together free content
                and testing tools that went nowhere. Agent Lab is everything I
                had to figure out the hard way, packaged so you don&apos;t have to.
              </p>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
