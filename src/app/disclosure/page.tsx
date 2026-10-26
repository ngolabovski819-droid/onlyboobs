import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
export const metadata: Metadata = {
  title: "Sponsorship Disclosure",
  alternates: { canonical: "/disclosure" },
};
export default function Disclosure() {
  return (
    <LegalPage title="Sponsorship Disclosure">
      <h2>Organic results</h2>
      <p>
        Popular results are ordered by supplied favourites counts within the
        indexed directory. Newest results use the date a creator was first seen
        in the dataset. These rankings are not a personal endorsement or an
        objective assessment of a creator.
      </p>
      <h2>Paid placements</h2>
      <p>
        OnlyBoobs supports paid creator placements. When a campaign is active,
        its cards or search placements are labelled Ad or Sponsored and can
        occupy reserved positions. Sponsored galleries and destination links may
        be supplied by the advertiser. No sponsor campaigns are currently
        configured, so current listings are organic directory results.
      </p>
      <h2>Referral links</h2>
      <p>
        Future campaigns may use tracking or referral links. Any applicable
        commission arrangement will be described here when activated. Clicking a
        link does not guarantee a particular experience or price on the
        destination website.
      </p>
    </LegalPage>
  );
}
