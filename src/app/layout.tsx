import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import SponsoredLinkTokenizer from "@/components/SponsoredLinkTokenizer";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { SPONSOR_CAMPAIGNS } from "@/config/sponsors";
import { site } from "@/config/site";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "OnlyBoobs — Every Size. Every Shape.",
    template: "%s | OnlyBoobs",
  },
  description: site.description,
  robots: { index: site.launchReady, follow: true },
  icons: {
    icon: "/onlytits-icon.png",
    apple: "/onlytits-icon.png",
  },
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  other: { rating: "adult" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
  };
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AgeGate />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {SPONSOR_CAMPAIGNS.length > 0 && <SponsoredLinkTokenizer />}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
