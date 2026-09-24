"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CoupleLogo } from "./CoupleLogo";
import { PageBackground } from "./PageBackground";
import { WeddingHeader } from "./WeddingHeader";
import { LANDING_TRANSITION_MS, waitForMotion } from "@/lib/client-motion";

export function LandingExperience() {
  const router = useRouter();
  const navigatingRef = useRef(false);
  const [isExiting, setExiting] = useState(false);

  async function openForm() {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setExiting(true);
    await waitForMotion(LANDING_TRANSITION_MS);
    router.push("/form");
  }

  return (
    <main className={`landing-page app-shell flex min-h-[100svh] flex-col items-center px-5 pb-[3.7svh] pt-[8.1svh] text-white${isExiting ? " landing-page-exit" : ""}`}>
      <PageBackground variant="landing" />
      <WeddingHeader />

      <div className="landing-bottom mt-auto flex flex-col items-center">
        <p className="landing-date mb-[4.5svh] text-center text-[9px] font-medium tracking-[0.28em]">SABTU&nbsp;&nbsp;•&nbsp;&nbsp;03&nbsp;&nbsp;•&nbsp;&nbsp;10&nbsp;&nbsp;•&nbsp;&nbsp;2026</p>
        <button type="button" onClick={openForm} disabled={isExiting} className="motion-pill flex h-11 min-w-[166px] items-center justify-center rounded-full bg-white px-8 text-[12px] font-medium text-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Take a Moment
        </button>
        <div className="landing-logo mt-[11svh]">
          <CoupleLogo />
        </div>
      </div>
    </main>
  );
}
