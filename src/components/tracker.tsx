"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let pageLoadTime = 0;

function alreadyTracked(page: string, event: string): boolean {
  try {
    const key = `tracked:${event}:${page}`;
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
    return false;
  } catch {
    return false;
  }
}

function sendTrack(page: string, event: string, value?: number) {
  if (alreadyTracked(page, event)) return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, event, ...(value !== undefined && { value }) }),
  }).catch(() => {});
}

function sendBeaconTrack(page: string, event: string, value?: number) {
  if (alreadyTracked(page, event)) return;
  const blob = new Blob(
    [JSON.stringify({ page, event, ...(value !== undefined && { value }) })],
    { type: "application/json" }
  );
  navigator.sendBeacon("/api/track", blob);
}

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    sendTrack(pathname, "view");
  }, [pathname]);

  return null;
}

export function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pageLoadTime = performance.now();

    // Scroll tracking
    const milestones = [25, 50, 75, 100] as const;
    let rafPending = false;

    function handleScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        const scrollHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        if (scrollHeight <= viewportHeight) return;
        const pct = (window.scrollY / (scrollHeight - viewportHeight)) * 100;
        for (const m of milestones) {
          if (pct >= m) {
            sendTrack(pathname, `scroll_${m}`);
          }
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Time on page tracking
    function sendTimeOnPage() {
      const elapsed = Math.round((performance.now() - pageLoadTime) / 1000);
      if (elapsed > 0) {
        sendBeaconTrack(pathname, "time_on_page", Math.min(elapsed, 3600));
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendTimeOnPage();
      }
    }

    function handleBeforeUnload() {
      sendTimeOnPage();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}

export function trackCta(page: string) {
  sendTrack(page, "cta_click");
  const elapsed = Math.round((performance.now() - pageLoadTime) / 1000);
  if (elapsed > 0) {
    sendTrack(page, "time_to_cta", Math.min(elapsed, 3600));
  }
}
