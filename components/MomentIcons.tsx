type IconProps = { className?: string };

export function GalleryIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="21.5" cy="11.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m6 23 7-7 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M10.5 8.5 12 6h8l1.5 2.5H26a3 3 0 0 1 3 3V24a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V11.5a3 3 0 0 1 3-3h4.5Z" fill="currentColor" />
      <circle cx="16" cy="17.5" r="5" fill="#1d311c" />
      <circle cx="16" cy="17.5" r="2.8" fill="currentColor" />
    </svg>
  );
}

export function FlipCameraIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M10.5 9 12 6.5h8L21.5 9H26a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h4.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M11 15a6 6 0 0 1 9.8-2l1.7 1.6M21 20a6 6 0 0 1-9.8 2L9.5 20.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m22.7 11.8-.2 2.8-2.8-.2M9.3 23.2l.2-2.8 2.8.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RetakeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M25.5 12A10.5 10.5 0 0 0 7.8 8.6L5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 6.8v4.7h4.7M6.5 20A10.5 10.5 0 0 0 24.2 23.4l2.8-2.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 25.2v-4.7h-4.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="m7 17 6 6L25 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4v15m0 0-5-5m5 5 5-5M6 22v5h20v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M21 7h5v5M25.5 7.5l-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 9H8a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="m28 5-9.5 22-4.2-9.3L5 13.5 28 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m14.3 17.7 5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
