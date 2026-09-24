"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon, FlipCameraIcon, GalleryIcon } from "./MomentIcons";
import { MomentPageShell, PhotoViewport, RoundActionButton } from "./MomentPageShell";
import { saveTemporaryPhoto } from "@/lib/photo-store";
import { ROUTE_TRANSITION_MS, waitForMotion } from "@/lib/client-motion";

type FacingMode = "environment" | "user";

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Photo capture failed"));
    }, "image/jpeg", 0.92);
  });
}

function validateImage(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }

    const source = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(source);
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("This image could not be opened."));
    };
    image.src = source;
  });
}

export function CameraExperience() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigatingRef = useRef(false);
  const actionRef = useRef(false);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [cameraReady, setCameraReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Starting camera...");
  const [isExiting, setExiting] = useState(false);
  const [isFlashing, setFlashing] = useState(false);
  const [flipTurned, setFlipTurned] = useState(false);

  const startCamera = useCallback(async (facing: FacingMode) => {
    const requestId = ++requestRef.current;
    setCameraReady(false);
    setMessage("Starting camera...");
    stopStream(streamRef.current);
    streamRef.current = null;

    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera is unavailable. You can still choose from Gallery.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: facing } },
      });

      if (requestId !== requestRef.current) {
        stopStream(stream);
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
      setMessage("");
    } catch {
      if (requestId === requestRef.current) {
        setMessage("Camera access is unavailable. You can still choose from Gallery.");
      }
    }
  }, []);

  useEffect(() => {
    void startCamera(facingMode);

    return () => {
      requestRef.current += 1;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [facingMode, startCamera]);

  async function capturePhoto() {
    const video = videoRef.current;
    if (!video || !cameraReady || !video.videoWidth || !video.videoHeight || busy || actionRef.current) return;

    actionRef.current = true;
    setBusy(true);
    setMessage("");

    try {
      const targetAspect = 9 / 16;
      const sourceAspect = video.videoWidth / video.videoHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = video.videoWidth;
      let sourceHeight = video.videoHeight;

      if (sourceAspect > targetAspect) {
        sourceWidth = video.videoHeight * targetAspect;
        sourceX = (video.videoWidth - sourceWidth) / 2;
      } else {
        sourceHeight = video.videoWidth / targetAspect;
        sourceY = (video.videoHeight - sourceHeight) / 2;
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.min(1080, Math.round(sourceWidth));
      canvas.height = Math.round(canvas.width / targetAspect);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");

      context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      const photo = await canvasToBlob(canvas);
      setFlashing(true);
      await Promise.all([saveTemporaryPhoto(photo), waitForMotion(140)]);
      setFlashing(false);
      stopStream(streamRef.current);
      streamRef.current = null;
      navigatingRef.current = true;
      setExiting(true);
      await waitForMotion(ROUTE_TRANSITION_MS);
      router.push("/select");
    } catch {
      actionRef.current = false;
      setMessage("The photo could not be captured. Please try again.");
      setBusy(false);
    }
  }

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busy || actionRef.current) return;

    actionRef.current = true;
    setBusy(true);
    setMessage("");
    try {
      await validateImage(file);
      await saveTemporaryPhoto(file);
      stopStream(streamRef.current);
      streamRef.current = null;
      navigatingRef.current = true;
      setExiting(true);
      await waitForMotion(ROUTE_TRANSITION_MS);
      router.push("/select");
    } catch (error) {
      actionRef.current = false;
      setMessage(error instanceof Error ? error.message : "The image could not be opened.");
      setBusy(false);
    }
  }

  function flipCamera() {
    if (busy || navigatingRef.current || actionRef.current) return;
    setFlipTurned((current) => !current);
    setFacingMode((current) => (current === "environment" ? "user" : "environment"));
  }

  return (
    <MomentPageShell className={`camera-page motion-page-enter${isExiting ? " motion-page-exit" : ""}`}>
      <section className="moment-stage" aria-label="Camera">
        <PhotoViewport>
          <video
            ref={videoRef}
            className={`moment-media ${facingMode === "user" ? "moment-media-mirrored" : ""}`}
            autoPlay
            playsInline
            muted
          />
          {message && <p className="moment-message" role="status">{message}</p>}
          <span className={`camera-flash${isFlashing ? " camera-flash-active" : ""}`} aria-hidden="true" />
        </PhotoViewport>

        <button className="capture-button" type="button" onClick={capturePhoto} disabled={!cameraReady || busy} aria-label="Capture photo">
          <CameraIcon className="capture-icon" />
        </button>
      </section>

      <div className="moment-controls">
        <RoundActionButton label="Gallery" icon={<GalleryIcon className="moment-control-icon" />} onClick={() => fileInputRef.current?.click()} disabled={busy} />
        <RoundActionButton label="Flip Camera" icon={<FlipCameraIcon className={`moment-control-icon flip-camera-icon${flipTurned ? " flip-camera-icon-turned" : ""}`} />} onClick={flipCamera} disabled={busy} />
      </div>

      <input ref={fileInputRef} className="sr-only" type="file" accept="image/*" onChange={choosePhoto} tabIndex={-1} />
    </MomentPageShell>
  );
}
