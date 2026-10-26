"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Brand from "./Brand";
const key = "onlyboobs_age_confirmed";
const event = "onlyboobs-age-change";
let sessionConfirmed = false;
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  return () => window.removeEventListener(event, callback);
}
function snapshot() {
  try {
    return sessionConfirmed || localStorage.getItem(key) === "1";
  } catch {
    return sessionConfirmed;
  }
}
const publicPages = [
  "/privacy",
  "/terms",
  "/dmca",
  "/contact",
  "/cookies",
  "/disclosure",
  "/about",
];
export default function AgeGate() {
  const pathname = usePathname();
  const confirmed = useSyncExternalStore(subscribe, snapshot, () => false);
  const panel = useRef<HTMLDivElement>(null);
  const visible = !confirmed && !publicPages.includes(pathname);
  useEffect(() => {
    if (!visible) return;
    const previous = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = bodyOverflow;
      previous?.focus();
    };
  }, [visible]);
  if (!visible) return null;
  function confirm() {
    sessionConfirmed = true;
    try {
      localStorage.setItem(key, "1");
    } catch {}
    window.dispatchEvent(new Event(event));
  }
  return (
    <div
      className="age-gate-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
    >
      <div
        ref={panel}
        className="age-gate-modal"
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const nodes =
            panel.current?.querySelectorAll<HTMLElement>("button,a");
          if (!nodes?.length) return;
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="age-gate-logo">
          <Brand />
        </div>
        <p className="eyebrow">A little check before you explore</p>
        <h1 id="age-title" className="age-gate-title">
          Adults only
        </h1>
        <p className="age-gate-text">
          OnlyBoobs is a directory for people aged 18 and over. Please confirm
          that you are an adult before continuing.
        </p>
        <div className="age-gate-actions">
          <button
            className="age-gate-btn age-gate-btn--confirm"
            onClick={confirm}
          >
            I’m 18 or older — enter
          </button>
          <button
            className="age-gate-btn age-gate-btn--exit"
            onClick={() => window.location.assign("https://www.google.com")}
          >
            Exit
          </button>
        </div>
        <p className="age-gate-legal">
          <Link href="/terms">Terms</Link> ·{" "}
          <Link href="/privacy">Privacy</Link> ·{" "}
          <Link href="/contact">Contact</Link>
        </p>
      </div>
    </div>
  );
}
