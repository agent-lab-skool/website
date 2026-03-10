"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { SKOOL_URL } from "@/lib/constants/links";
import { trackCta } from "@/components/tracker";

export function ScrollCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollRatio =
          window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (scrollRatio >= 0.5) {
          setVisible(true);
          window.removeEventListener("scroll", onScroll);
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-white/10 bg-neutral-950 p-5 shadow-2xl sm:left-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
        >
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close popup"
            className="absolute top-3 right-3 text-neutral-500 transition-colors hover:text-white"
          >
            <X className="size-4" />
          </button>

          <p className="text-base font-medium text-white">
            Want the full playbook?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            This guide is just the start. Get video walkthroughs, templates, and
            the exact prompts I use to build with AI.
          </p>

          <div className="mt-4">
            <RainbowButton asChild size="default">
              <a
                href={SKOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn"
                onClick={() => {
                  track("guide_cta_click", { type: "scroll_popup" });
                  trackCta(pathname);
                }}
              >
                Join Agent Lab
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </a>
            </RainbowButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
