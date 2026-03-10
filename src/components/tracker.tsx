"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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

function sendTrack(page: string, event: string) {
  if (alreadyTracked(page, event)) return;
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, event }),
  }).catch(() => {});
}

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    sendTrack(pathname, "view");
  }, [pathname]);

  return null;
}

export function trackCta(page: string) {
  sendTrack(page, "cta_click");
}
