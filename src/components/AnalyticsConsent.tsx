"use client";
import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
const key = "onlyboobs_analytics_consent",
  event = "onlyboobs-consent-change";
const gaId = process.env.NEXT_PUBLIC_GA_ID;
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}
function get() {
  try {
    return localStorage.getItem(key) ?? "unset";
  } catch {
    return "denied";
  }
}
function save(value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(event));
  if (value === "denied") window.location.reload();
}
export default function AnalyticsConsent({
  preferences = false,
}: {
  preferences?: boolean;
}) {
  const consent = useSyncExternalStore(subscribe, get, () => "unset");
  if (!gaId)
    return preferences ? (
      <p>
        Optional analytics are currently disabled. No Google Analytics cookies
        are set by this site.
      </p>
    ) : null;
  if (preferences)
    return (
      <div>
        <p>
          Optional analytics: {consent === "granted" ? "enabled" : "disabled"}.
        </p>
        <div className="consent-actions">
          <button className="btn btn--outline" onClick={() => save("denied")}>
            Reject / withdraw
          </button>
          <button className="btn btn--primary" onClick={() => save("granted")}>
            Allow analytics
          </button>
        </div>
      </div>
    );
  return (
    <>
      {consent === "granted" && <GoogleAnalytics gaId={gaId} />}{" "}
      {consent === "unset" && (
        <div
          className="consent-banner"
          role="region"
          aria-label="Analytics preferences"
        >
          <p>
            May we use optional analytics to understand site usage? You can
            change your choice in{" "}
            <Link href="/cookies">cookie preferences</Link>.
          </p>
          <div className="consent-actions">
            <button className="btn btn--outline" onClick={() => save("denied")}>
              Reject
            </button>
            <button
              className="btn btn--primary"
              onClick={() => save("granted")}
            >
              Allow
            </button>
          </div>
        </div>
      )}
    </>
  );
}
