import { ReactNode } from "react";
import { CoupleLogo } from "./CoupleLogo";

export function MomentPageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`moment-shell app-shell ${className}`}>
      <div className="moment-logo">
        <CoupleLogo />
      </div>
      {children}
    </main>
  );
}

export function PhotoViewport({ children }: { children: ReactNode }) {
  return <div className="moment-viewport">{children}</div>;
}

export function RoundActionButton({
  label,
  icon,
  onClick,
  disabled = false,
  className = "",
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button className={`moment-action ${className}`} type="button" onClick={onClick} disabled={disabled}>
      <span className="moment-action-circle">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
