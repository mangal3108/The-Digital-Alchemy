import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal-page";
import { JsonLd } from "@/components/ui/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSiteSettings, formatAddress } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Privacy Policy | The Digital Alchemy",
    description:
      "How The Digital Alchemy collects, uses and stores personal information submitted through this website, and the choices available to you.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <>
      <LegalPage
        title="Privacy Policy"
        updated="7 September 2026"
        crumbs={crumbs}
      >
        <h2>Who we are</h2>
        <p>
          {settings.companyName} is a digital product, software and growth
          studio{address ? ` based at ${address}` : ""}. We are the controller
          of the personal information described in this policy. You can reach us
          about anything here at{" "}
          {settings.email ? (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          ) : (
            "our published contact address"
          )}
          .
        </p>

        <h2>What we collect</h2>
        <p>
          We collect only what we need to respond to you and to understand
          whether this website is working.
        </p>
        <ul>
          <li>
            <strong>Information you give us.</strong> When you submit the
            enquiry form we collect your name, email address and message, plus
            the optional details you choose to provide: phone number, company,
            country, the services you are interested in, an approximate budget
            and a timeline.
          </li>
          <li>
            <strong>How you reached us.</strong> With each enquiry we record the
            page you submitted from, the referring website, and any campaign
            parameters in the link you followed. This tells us which of our
            activities actually produce enquiries.
          </li>
          <li>
            <strong>Technical information.</strong> Our servers record the IP
            address of form submissions. This is used to rate-limit the form and
            to identify automated abuse, and for nothing else.
          </li>
          <li>
            <strong>Analytics.</strong> If you consent to analytics cookies, we
            collect aggregated information about pages viewed and actions taken.
          </li>
        </ul>
        <p>
          We do not buy contact lists, and we do not collect special category
          data through this website.
        </p>

        <h2>Why we use it, and on what basis</h2>
        <ul>
          <li>
            <strong>To reply to your enquiry.</strong> Because you asked us to,
            and because we have a legitimate interest in responding to people
            who contact our business.
          </li>
          <li>
            <strong>To prevent abuse of our forms.</strong> Our legitimate
            interest in keeping the site usable.
          </li>
          <li>
            <strong>To measure and improve the website.</strong> Only with your
            consent, which you give through the cookie banner and can withdraw
            at any time.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Strictly necessary cookies are used to keep the site and its forms
          working, and to remember your cookie choice. These are always active
          because the site cannot function without them.
        </p>
        <p>
          Analytics and marketing cookies are loaded only after you consent. If
          you decline, those scripts are never added to the page — we do not
          load them first and ask afterwards. You can change your choice at any
          time by clearing this site&rsquo;s stored data in your browser, which
          will bring the banner back.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We do not sell personal information. We share it only with service
          providers that help us operate this website and respond to you: our
          hosting provider, our email provider for sending and receiving
          messages, and, where you have consented, our analytics providers.
          Each processes the data on our instructions.
        </p>

        <h2>Where it is stored</h2>
        <p>
          Enquiries are stored in our own database on infrastructure we control.
          Depending on the provider used for a given deployment, that
          infrastructure may be located outside your country. Where information
          is transferred internationally, we rely on the safeguards offered by
          the provider for that transfer.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep enquiries for as long as there is a realistic prospect of
          doing business together, and then for a reasonable period afterwards
          for our own records. Submissions identified as automated spam are
          retained briefly and then deleted. If you would like your enquiry
          removed sooner, ask us and we will do it.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to ask for a copy
          of the information we hold about you, to have it corrected or deleted,
          to object to or restrict how we use it, and to withdraw consent you
          have previously given. To exercise any of these, contact us at the
          address above. We will not charge you for a reasonable request, and we
          will respond within the period required by the law that applies to
          you.
        </p>
        <p>
          If you are unhappy with how we have handled your information, you are
          entitled to complain to the data protection authority in your country.
        </p>

        <h2>Security</h2>
        <p>
          Information submitted through this site is transmitted over an
          encrypted connection. Access to stored enquiries requires an
          authenticated administrator account with role-based permissions, and
          consequential actions on that data are logged. No system is perfectly
          secure, but we take this seriously and design for it rather than
          bolting it on.
        </p>

        <h2>Children</h2>
        <p>
          This website is aimed at businesses and is not directed at children.
          We do not knowingly collect information from children.
        </p>

        <h2>Changes</h2>
        <p>
          If we change this policy we will update the date at the top of the
          page. Where a change is significant, we will make that clear rather
          than relying on you noticing.
        </p>
      </LegalPage>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
