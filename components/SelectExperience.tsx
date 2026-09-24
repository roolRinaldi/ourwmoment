"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, RetakeIcon } from "./MomentIcons";
import { MomentPageShell, PhotoViewport, RoundActionButton } from "./MomentPageShell";
import { clearTemporaryPhoto, getTemporaryPhoto } from "@/lib/photo-store";
import { ROUTE_TRANSITION_MS, waitForMotion } from "@/lib/client-motion";

export function SelectExperience() {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigatingRef = useRef(false);
  const [isExiting, setExiting] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    void getTemporaryPhoto()
      .then((photo) => {
        if (!active) return;
        if (!photo) {
          router.replace("/camera");
          return;
        }
        objectUrl = URL.createObjectURL(photo);
        setPhotoUrl(objectUrl);
        setLoading(false);
      })
      .catch(() => router.replace("/camera"));

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [router]);

  async function retakePhoto() {
    if (navigatingRef.current || loading) return;
    navigatingRef.current = true;
    await clearTemporaryPhoto();
    setExiting(true);
    await waitForMotion(ROUTE_TRANSITION_MS);
    router.replace("/camera");
  }

  async function selectPhoto() {
    if (navigatingRef.current || loading || !photoUrl) return;
    navigatingRef.current = true;
    setExiting(true);
    await waitForMotion(ROUTE_TRANSITION_MS);
    router.push("/result");
  }

  return (
    <MomentPageShell className={`select-page motion-page-enter${isExiting ? " motion-page-exit" : ""}`}>
      <section className="moment-stage" aria-label="Selected photo preview">
        <PhotoViewport>
          {photoUrl && <img className="moment-media" src={photoUrl} alt="Selected wedding moment" />}
          {loading && <p className="moment-message" role="status">Loading photo...</p>}
        </PhotoViewport>
      </section>

      <div className="moment-controls select-controls">
        <RoundActionButton label="Re-Take" icon={<RetakeIcon className="moment-control-icon" />} onClick={retakePhoto} disabled={loading || isExiting} />
        <RoundActionButton label="Select" icon={<CheckIcon className="moment-control-icon" />} onClick={selectPhoto} disabled={loading || isExiting} />
      </div>
    </MomentPageShell>
  );
}
