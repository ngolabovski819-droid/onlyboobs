import type { Metadata } from "next";
import LegalPage, { ContactLink } from "@/components/LegalPage";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <h2>About this directory</h2>
      <p>
        OnlyBoobs is an independent creator-discovery directory. For privacy
        questions, use our <ContactLink />.
      </p>
      <h2>Information processed</h2>
      <p>
        The directory displays creator names, usernames, public descriptions,
        profile images, stated locations, subscription prices and activity
        statistics supplied by our connected creator-profile dataset. We use
        public description text to assign discovery categories; we do not infer
        a creator’s characteristics from photographs. Visitors can browse
        without creating an account. Search terms are sent to the site to return
        matching profiles.
      </p>
      <p>
        Our hosting and security providers may process request data such as IP
        address, browser and device information, requested URLs, timestamps and
        referring pages to deliver, protect and troubleshoot the service. We do
        not operate user accounts or sell visitor personal information.
      </p>
      <h2>Local storage, cookies and analytics</h2>
      <p>
        Your browser stores adult-entry confirmation, up to eight recent search
        terms, and your optional analytics choice in local storage. Clear recent
        searches in the search menu or remove local site data in your browser.
        Google Analytics is disabled unless an analytics ID is configured; when
        configured, it loads only after you consent. You can reject or withdraw
        consent through{" "}
        <Link href="/cookies" className="text-link">
          cookie preferences
        </Link>
        . Hosting providers may also use strictly necessary technologies for
        security and service delivery; consult their notices for details.
      </p>
      <h2>Sponsored links</h2>
      <p>
        No paid campaigns are currently active. If campaigns are enabled, the
        redirect may record click time, creator, browser user agent, referring
        page, placement, IP address and a salted IP hash, approximate country
        and city, and bot/link-verification signals. These data are used for
        campaign reporting, rate-limiting and abuse prevention. Campaign
        tracking must not be enabled until its purpose, lawful basis, access
        controls and retention period have been set and disclosed.
      </p>
      <h2>Providers and external websites</h2>
      <p>
        We use Vercel hosting, a connected Supabase database and image delivery
        infrastructure to operate the directory. Profile images may be fetched
        and cached through the image service. When you follow a creator link,
        you leave OnlyBoobs; that destination’s operator handles data under its
        own terms and privacy notice. We do not process creator subscriptions
        or collect payment-card details.
      </p>
      <h2>Retention, security and your choices</h2>
      <p>
        Local browser data remains until it expires or you remove it. Hosting
        providers retain operational logs under their own terms. We will set
        and publish retention periods for any enquiry or campaign records
        before collecting them. We use reasonable measures to protect
        information, but no internet transmission or storage system can be
        guaranteed completely secure. Depending on your location, you may have
        rights to request access, correction or deletion, or to object to or
        restrict certain processing. Contact <ContactLink /> to make a request
        or complain to your local privacy regulator.
      </p>
      <h2>Children, changes and complaints</h2>
      <p>
        This is an adult-oriented service and is not intended for anyone under
        18. We do not knowingly seek personal information from children. We may
        update this policy by publishing a revised version here. Depending on
        where you live, you may also contact your local privacy regulator with a
        complaint.
      </p>
    </LegalPage>
  );
}
