/**
 * Tiny analytics wrapper. Routes named events through Vercel Analytics'
 * custom-event channel and mirrors to the console in development.
 * Swap the body to point at a different sink without touching callers.
 */
import { track as vercelTrack } from "@vercel/analytics";

type TrackProps = Record<string, string | number | boolean | null>;

export function track(event: string, props: TrackProps = {}): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(`[track] ${event}`, props);
  }
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics must never break the UI */
  }
}
