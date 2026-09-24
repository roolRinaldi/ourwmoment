"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CoupleLogo } from "./CoupleLogo";
import { DownloadIcon, SendIcon, ShareIcon } from "./MomentIcons";
import { clearTemporaryPhoto, getTemporaryPhoto } from "@/lib/photo-store";
import {
  downloadTemplate,
  renderWeddingTemplate,
  TEMPLATE_FILENAME,
  type WeddingTemplateData,
} from "@/lib/render-wedding-template";
import { MODAL_TRANSITION_MS, waitForMotion } from "@/lib/client-motion";

const GUEST_STORAGE_KEY = "weddingMomentGuest";

type GuestData = { name?: string; wishes?: string };

function ResultAction({
  label,
  icon,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="result-action" type="button" onClick={onClick} disabled={disabled}>
      <span className="result-action-circle">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ThankYouDialog({ onBackHome, isClosing }: { onBackHome: () => void; isClosing: boolean }) {
  const backHomeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    backHomeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className={`thank-you-overlay${isClosing ? " thank-you-overlay-closing" : ""}`}>
      <div className="thank-you-backdrop" aria-hidden="true" />
      <div
        className="thank-you-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-title"
      >
        <div className="thank-you-card">
          <img className="thank-you-wax" src="/images/wax.png" alt="" />
          <div className="thank-you-card-inner">
            <h2 id="thank-you-title">THANK YOU FOR YOUR<br />MOMENT &amp; MESSAGE</h2>
            <p>Fachrul &amp; Tasya</p>
          </div>
        </div>
        <button ref={backHomeRef} className="thank-you-home" type="button" onClick={onBackHome}>
          Back To Home
        </button>
      </div>
    </div>
  );
}

export function ResultExperience() {
  const router = useRouter();
  const generationRef = useRef<Promise<Blob> | null>(null);
  const homeNavigationRef = useRef(false);
  const actionRef = useRef(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [isThankYouOpen, setThankYouOpen] = useState(false);
  const [isThankYouClosing, setThankYouClosing] = useState(false);
  const [status, setStatus] = useState("Preparing your moment...");

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function prepareResult() {
      let guest: GuestData | null = null;
      try {
        const stored = sessionStorage.getItem(GUEST_STORAGE_KEY);
        guest = stored ? (JSON.parse(stored) as GuestData) : null;
      } catch {
        sessionStorage.removeItem(GUEST_STORAGE_KEY);
      }

      if (!guest?.name?.trim() || !guest.wishes?.trim()) {
        router.replace("/form");
        return;
      }

      const photo = await getTemporaryPhoto().catch(() => null);
      if (!photo) {
        router.replace("/camera");
        return;
      }

      const templateData: WeddingTemplateData = {
        name: guest.name.trim(),
        wishes: guest.wishes.trim(),
        photo,
      };
      generationRef.current = renderWeddingTemplate(templateData);
      const result = await generationRef.current;
      if (!active) return;

      objectUrl = URL.createObjectURL(result);
      setPreviewUrl(objectUrl);
      setReady(true);
      setStatus("");
    }

    void prepareResult().catch(() => {
      if (!active) return;
      setStatus("Your moment could not be prepared. Please select the photo again.");
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [router]);

  async function getGeneratedTemplate() {
    if (!generationRef.current) throw new Error("Template is not ready");
    return generationRef.current;
  }

  async function handleDownload() {
    if (busy || !ready || actionRef.current) return;
    actionRef.current = true;
    setBusy(true);
    try {
      downloadTemplate(await getGeneratedTemplate());
    } finally {
      actionRef.current = false;
      setBusy(false);
    }
  }

  async function handleShare() {
    if (busy || !ready || actionRef.current) return;
    actionRef.current = true;
    setBusy(true);
    try {
      const blob = await getGeneratedTemplate();
      const file = new File([blob], TEMPLATE_FILENAME, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Fachrul & Tasya Wedding Moment" });
      } else {
        downloadTemplate(blob);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setStatus("Sharing is unavailable. Please use Download instead.");
      }
    } finally {
      actionRef.current = false;
      setBusy(false);
    }
  }

  function handleKirim() {
    if (busy || !ready || actionRef.current || isThankYouOpen) return;
    setThankYouOpen(true);
  }

  async function handleBackHome() {
    if (homeNavigationRef.current) return;
    homeNavigationRef.current = true;
    setThankYouClosing(true);
    sessionStorage.removeItem(GUEST_STORAGE_KEY);
    generationRef.current = null;

    try {
      await Promise.all([clearTemporaryPhoto(), waitForMotion(MODAL_TRANSITION_MS)]);
    } finally {
      router.replace("/");
    }
  }

  return (
    <main className="result-shell result-page-enter app-shell">
      <div className={`result-content${isThankYouOpen ? " result-content-blurred" : ""}`}>
        <div className="result-logo"><CoupleLogo /></div>

        <div className={`result-preview${previewUrl ? " result-preview-ready" : ""}`} aria-label="Final wedding moment preview">
          {previewUrl ? <img src={previewUrl} alt="Final wedding moment artwork" /> : <p>{status}</p>}
        </div>

        <div className="result-actions">
          <ResultAction label="Download" icon={<DownloadIcon className="result-action-icon" />} onClick={handleDownload} disabled={!ready || busy} />
          <ResultAction label="Share" icon={<ShareIcon className="result-action-icon" />} onClick={handleShare} disabled={!ready || busy} />
          <ResultAction label="Kirim" icon={<SendIcon className="result-action-icon" />} onClick={handleKirim} disabled={!ready || busy} />
        </div>

        <p className="sr-only" aria-live="polite">{status}</p>
      </div>
      {isThankYouOpen && <ThankYouDialog onBackHome={handleBackHome} isClosing={isThankYouClosing} />}
    </main>
  );
}
