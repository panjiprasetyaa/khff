"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TiketRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const destination = qs ? `/registrasi/?${qs}` : "/registrasi/";
    router.replace(destination);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-khff-navy text-khff-cream flex items-center justify-center font-mono">
      <div className="animate-pulse text-khff-yellow flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-khff-yellow animate-ping" />
        <span>Mengalihkan ke halaman registrasi...</span>
      </div>
    </div>
  );
}

export default function TiketRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-khff-navy text-khff-cream flex items-center justify-center font-mono">
          <div className="animate-pulse text-khff-yellow flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-khff-yellow animate-ping" />
            <span>Mengalihkan...</span>
          </div>
        </div>
      }
    >
      <TiketRedirectHandler />
    </Suspense>
  );
}
