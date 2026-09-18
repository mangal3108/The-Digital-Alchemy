import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/sections/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSiteSettings, formatAddress } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Terms of Use | The Digital Alchemy",
    description:
      "The terms on which The Digital Alchemy makes this website available, including intellectual property, acceptable use and liability.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Terms of Use", href: "/terms" },
  ];

  return (
    <>
      <LegalPage title="Terms of Use" updated="7 September 2026" crumbs={crumbs}>
        <h2>These terms</h2>
        <p>
          This website is operated by {settings.companyName}
          {address ? `, ${address}` : ""}. By using the site you accept these
          terms. If you do not accept them, please do not use the site.
        </p>
        <p>
          These terms cover the website only. Work we carry out for clients is
          governed by a separate written agreement, and nothing here replaces or
          overrides that agreement.
        </p>

        <h2>What the site is for</h2>
        <p>
          This website describes our services and lets you get in touch. The
          content is provided for general information. It does not constitute
          professional, technical, financial or legal advice, and you should not
          treat it as a recommendation for your specific situation.
        </p>

        <h2>Enquiries and quotations</h2>
        <p>
          Submitting the enquiry form does not create a contract and does not
          oblige either of us to proceed. Any budget ranges shown on the site
          are indicative and exist to help you gauge fit — they are not
          quotations. A quotation is only binding when we provide it in writing
          against an agreed scope.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            use the site in a way that breaks any applicable law, or that could
            damage, disable or impair it;
          </li>
          <li>
            attempt to gain unauthorised access to any part of the site, its
            servers, or any connected system;
          </li>
          <li>
            submit anything through our forms that is unlawful, misleading,
            abusive or contains malicious code;
          </li>
          <li>
            use automated systems to scrape the site, or to submit forms, beyond
            what is reasonable;
          </li>
          <li>
            reproduce substantial parts of the site for commercial purposes
            without our permission.
          </li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          The content, design, code and branding of this website belong to us or
          to our licensors, and are protected by intellectual property law. You
          may view and print pages for your own legitimate business use. Any
          other reproduction, distribution or adaptation needs our written
          permission.
        </p>
        <p>
          Client names, trade marks and project material shown on this site
          remain the property of their respective owners and appear with
          permission.
        </p>

        <h2>Work we produce for clients</h2>
        <p>
          Where we carry out paid work, ownership of the deliverables passes to
          the client on the terms set out in the relevant agreement — typically
          on full payment. That agreement, not this page, determines what is
          assigned and what is licensed.
        </p>

        <h2>Availability</h2>
        <p>
          We aim to keep the site available, but we do not guarantee
          uninterrupted access. We may change, suspend or withdraw any part of
          it without notice, including for maintenance.
        </p>

        <h2>Third-party links</h2>
        <p>
          Where we link to other websites, we do so for information. We do not
          control those sites and are not responsible for their content or their
          handling of your data.
        </p>

        <h2>Liability</h2>
        <p>
          Nothing in these terms excludes or limits our liability for death or
          personal injury caused by negligence, for fraud, or for anything else
          that cannot lawfully be excluded.
        </p>
        <p>
          Subject to that, we are not liable for any indirect or consequential
          loss, or for loss of profit, revenue, business or data, arising from
          your use of this website. The site is provided on an &ldquo;as
          is&rdquo; basis.
        </p>

        <h2>Privacy</h2>
        <p>
          How we handle personal information is set out in our{" "}
          <Link href="/privacy">Privacy Policy</Link>, which forms part of these
          terms.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The version published on
          this page is the one that applies, and the date at the top shows when
          it last changed.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of India, and the courts of
          Delhi have jurisdiction over any dispute arising from them. If you are
          a consumer in another country, this does not remove protections
          available to you under the law of the country where you live.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          {settings.email ? (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          ) : (
            "our published contact address"
          )}
          .
        </p>
      </LegalPage>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
