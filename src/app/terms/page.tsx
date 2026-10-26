import type { Metadata } from "next";
import LegalPage, { ContactLink } from "@/components/LegalPage";
export const metadata: Metadata = {
  title: "Terms of Use",
  alternates: { canonical: "/terms" },
};
export default function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <h2>Adult eligibility</h2>
      <p>
        You must be at least 18 years old (or older if the law where you live
        sets a higher age) and legally permitted to access this directory. The
        age confirmation is your statement; it is not identity verification.
        Do not use the site if adult material or this service is unlawful where
        you are.
      </p>
      <h2>Directory service</h2>
      <p>
        OnlyBoobs helps visitors discover creator profiles. We do not process
        subscriptions or payments and do not control the services offered on
        external websites. OnlyBoobs is independent of OnlyFans and Fenix
        International Limited.
      </p>
      <h2>Profile information and rankings</h2>
      <p>
        Profile data may be incomplete or out of date. Confirm current prices,
        availability and terms on the official creator page. Categories reflect
        profile descriptions rather than independently measured attributes.
        Popular ordering uses supplied favourites counts within our indexed
        collection; newest ordering uses the date a profile was first seen in
        the dataset.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Use the site only as permitted by applicable law. You must not disrupt
        or probe non-public systems, use automated access in a way that
        overloads or circumvents site controls, impersonate another person,
        infringe rights, or misuse enquiry channels. Do not send passwords,
        payment details or sensitive identity documents through ordinary
        contact requests.
      </p>
      <h2>Paid placements</h2>
      <p>
        Paid placements, when enabled, are labelled Ad or Sponsored and may
        occupy reserved positions. Payment for a placement does not constitute
        an endorsement or guarantee of subscriber results.
      </p>
      <h2>Copyright, corrections and removal</h2>
      <p>
        Creator materials remain subject to the rights of their owners. If a
        listing is incorrect or material infringes your rights, use{" "}
        <ContactLink /> and identify the affected page or material.
      </p>
      <h2>Disclaimers and liability</h2>
      <p>
        To the extent permitted by law, the directory is provided “as is” and
        “as available”. We do not guarantee uninterrupted access or the
        accuracy, completeness or continued availability of a creator profile.
        Nothing in these terms excludes a consumer guarantee, right or remedy
        that cannot legally be excluded or limited. Subject to those mandatory
        protections, we are not liable for indirect or consequential loss
        arising from use of the directory or third-party services.
      </p>
      <h2>Changes and governing law</h2>
      <p>
        We may update the directory and these terms. Updated terms take effect
        when posted. The laws and courts that apply depend on the circumstances
        and the protections that apply where you live. Nothing in these terms
        limits rights or remedies that cannot legally be limited.
      </p>
    </LegalPage>
  );
}
