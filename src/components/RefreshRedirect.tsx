"use client";

import { useEffect } from "react";

export default function RefreshRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      const navEntries = window.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      const isReload =
        (navEntries && navEntries.length > 0 && navEntries[0].type === "reload") ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window.performance as any).navigation && (window.performance as any).navigation.type === 1);

      if (isReload) {
        window.location.replace("/");
      }
    }
  }, []);

  return null;
}
