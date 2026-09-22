"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, RetakeIcon } from "./MomentIcons";
import { MomentPageShell, PhotoViewport, RoundActionButton } from "./MomentPageShell";
import { clearTemporaryPhoto, getTemporaryPhoto } from "@/lib/photo-store";

export function SelectExperience() {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    await clearTemporaryPhoto();
    router.replace("/camera");
  }

  function selectPhoto() {
    if (!loading && photoUrl) router.push("/result");
  }

  return (
    <MomentPageShell>
      <section className="moment-stage" aria-label="Selected photo preview">
        <PhotoViewport>
          {photoUrl && <img className="moment-media" src={photoUrl} alt="Selected wedding moment" />}
          {loading && <p className="moment-message" role="status">Loading photo...</p>}
        </PhotoViewport>
      </section>

      <div className="moment-controls select-controls">
        <RoundActionButton label="Re-Take" icon={<RetakeIcon className="moment-control-icon" />} onClick={retakePhoto} disabled={loading} />
        <RoundActionButton label="Select" icon={<CheckIcon className="moment-control-icon" />} onClick={selectPhoto} disabled={loading} />
      </div>
    </MomentPageShell>
  );
}
