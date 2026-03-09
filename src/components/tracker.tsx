"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname, event: "view" }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}

export function trackCta(page: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, event: "cta_click" }),
  }).catch(() => {});
}
