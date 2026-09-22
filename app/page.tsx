import Link from "next/link";
import { CoupleLogo } from "@/components/CoupleLogo";
import { PageBackground } from "@/components/PageBackground";
import { WeddingHeader } from "@/components/WeddingHeader";

export default function LandingPage() {
  return (
    <main className="app-shell flex min-h-[100svh] flex-col items-center px-5 pb-[2svh] pt-[8.1svh] text-white">
      <PageBackground variant="landing" />
      <WeddingHeader />

      <div className="mt-auto flex flex-col items-center">
        <p className="mb-[4.5svh] text-center text-[9px] font-medium tracking-[0.28em]">SABTU&nbsp;&nbsp;•&nbsp;&nbsp;03&nbsp;&nbsp;•&nbsp;&nbsp;10&nbsp;&nbsp;•&nbsp;&nbsp;2026</p>
        <Link href="/form" className="flex h-11 min-w-[166px] items-center justify-center rounded-full bg-white px-8 text-[12px] font-medium text-neutral-800 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Take a Moment
        </Link>
        <div className="mt-[11svh]">
          <CoupleLogo />
        </div>
      </div>
    </main>
  );
}
