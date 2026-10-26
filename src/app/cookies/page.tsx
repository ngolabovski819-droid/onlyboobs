import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import AnalyticsConsent from "@/components/AnalyticsConsent";
export const metadata: Metadata = {
  title: "Cookies & Preferences",
  alternates: { canonical: "/cookies" },
};
export default function Cookies() {
  return (
    <LegalPage title="Cookies & Preferences">
      <h2>Your analytics choice</h2>
      <AnalyticsConsent preferences />
      <h2>Browser storage</h2>
      <p>
        OnlyBoobs stores adult-entry confirmation, up to eight recent search
        terms, and your analytics choice in local browser storage. Search
        history can be cleared from the search menu. Clearing site data in your
        browser also removes these entries. These browser settings are
        necessary for the corresponding preferences and are not used to track
        you across other websites.
      </p>
      <h2>Optional analytics</h2>
      <p>
        If optional analytics are enabled, they load after you choose to allow
        them. You can change that choice on this page. Rejecting analytics does
        not prevent browsing.
      </p>
      <h2>External sites</h2>
      <p>
        Following an external creator link takes you to a separate service,
        which controls its own cookies and storage.
      </p>
      <h2>Hosting and image delivery</h2>
      <p>
        Our hosting, security and image-delivery providers may use technical
        logs or necessary storage to deliver, protect and troubleshoot the
        service. Their own privacy and cookie notices describe their practices.
        Optional Google Analytics is disabled unless configured and is not
        loaded before consent.
      </p>
    </LegalPage>
  );
}
