import type { Metadata } from "next";
import LegalPage, { ContactLink } from "@/components/LegalPage";
export const metadata: Metadata = {
  title: "DMCA & Content Removal",
  alternates: { canonical: "/dmca" },
};
export default function Dmca() {
  return (
    <LegalPage title="DMCA & Content Removal">
      <p>
        Creators and rights holders can request removal or correction of
        listings and material displayed by OnlyBoobs. The directory links to
        external creator pages and may deliver profile images through an image
        optimization/cache service. A request to OnlyBoobs does not remove
        material from the original platform.
      </p>
      <h2>Remove or correct your listing</h2>
      <p>
        Provide the creator username, the OnlyBoobs URL, the requested
        correction or removal, and a reasonable way to verify your authority.
        Do not send your password or payment details. We review verified
        requests and, when a removal is approved, add the username to a
        suppression list to prevent routine data refreshes from restoring it.
      </p>
      <h2>Copyright notice</h2>
      <p>
        If you are submitting a notice under the United States DMCA, identify
        the copyrighted work and the material you believe is infringing,
        including its exact OnlyBoobs URL. Include your name and contact
        information, a good-faith belief statement, the required accuracy and
        authority statement under penalty of perjury, and a physical or
        electronic signature. Notices should be sufficiently detailed for us to
        locate and assess the material. Knowingly material misrepresentations
        may have legal consequences.
      </p>
      <h2>Where to send a request</h2>
      <p>
        A public reporting email is not currently available, so this page does
        not accept submissions. If you need to reach the directory, see our{" "}
        <ContactLink />. A DMCA page alone does not establish safe-harbor
        eligibility; a service seeking those protections must separately meet
        applicable requirements, including designated-agent registration where
        required.
      </p>
      <h2>Review and counter-notices</h2>
      <p>
        Where the DMCA applies and a valid counter-notice is received, we will
        process it in accordance with the applicable statutory procedure,
        including forwarding it to the complaining party where required.
        Applicable response and restoration periods are governed by that
        procedure. Other removal and correction requests are assessed
        separately.
      </p>
      <h2>External platforms</h2>
      <p>
        Removing a directory listing does not remove the underlying account or
        content from another platform. Requests about external content may also
        need to be addressed to that platform.
      </p>
    </LegalPage>
  );
}
