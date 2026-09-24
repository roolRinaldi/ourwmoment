export const ROUTE_TRANSITION_MS = 300;
export const LANDING_TRANSITION_MS = 420;
export const MODAL_TRANSITION_MS = 280;

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function waitForMotion(duration: number) {
  if (prefersReducedMotion()) return Promise.resolve();
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}
