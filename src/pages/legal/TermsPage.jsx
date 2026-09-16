import React from 'react';
import PolicyLayout, { Section, SubHeading } from '../../components/legal/PolicyLayout';

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      tagline="The rules that govern your use of dcltr.in"
      lastUpdated="September 14, 2026"
    >
      <Section title="1. Acceptance of Terms">
        <p>
          These Terms &amp; Conditions ("Terms") govern your access to and use of dcltr.in, including its
          buyer marketplace, seller portal (seller.dcltr.in), and admin services (collectively, the
          "Platform"), operated by <strong>[Legal Entity Name]</strong> ("dcltr.in", "we", "us", "our"). By
          creating an account, browsing listings, making a purchase, or listing a fragrance for sale, you
          agree to be bound by these Terms and our <strong>Privacy Policy</strong> and{' '}
          <strong>Refund &amp; Cancellation Policy</strong>. If you do not agree, please do not use the
          Platform.
        </p>
      </Section>

      <Section title="2. Eligibility & Account Registration">
        <p>
          You must be at least 18 years old and capable of entering into a legally binding contract under
          the Indian Contract Act, 1872 to use the Platform. When you register, you agree to provide
          accurate, current, and complete information and to keep it updated.
        </p>
        <p>
          Sellers are required to complete Know-Your-Customer (KYC) verification — including a valid
          government-issued ID and payout account details — before any listing can go live, in line with
          our anti-fraud and anti-money-laundering obligations. dcltr.in reserves the right to suspend
          accounts that fail or refuse KYC verification.
        </p>
      </Section>

      <Section title="3. Nature of the Platform">
        <p>
          dcltr.in is a peer-to-peer (P2P) marketplace that connects independent buyers and sellers of
          pre-loved, partial, and new fragrance bottles. dcltr.in is an intermediary under the Information
          Technology Act, 2000 and does not itself own, manufacture, or sell the fragrances listed on the
          Platform. Each listing is created and fulfilled solely by the individual seller, who is
          responsible for the accuracy of the listing, the condition of the item, and lawful title to sell
          it.
        </p>
      </Section>

      <Section title="4. Listings, Authenticity & Prohibited Items">
        <SubHeading>Seller Warranties</SubHeading>
        <p>
          By creating a listing, a seller warrants that the fragrance is genuine, is accurately described
          (including fill level, batch code, packaging, and condition), and that the seller has full legal
          right to sell it.
        </p>
        <SubHeading>Moderation</SubHeading>
        <p>
          Every new listing is reviewed by our authenticity moderation queue before it is published live.
          dcltr.in may reject, delist, or request additional verification for any listing at its sole
          discretion.
        </p>
        <SubHeading>Strictly Prohibited</SubHeading>
        <ul className="list-disc pl-5 space-y-1">
          <li>Counterfeit, replica, or "clone" fragrances misrepresented as genuine.</li>
          <li>Fragrances repackaged into non-original containers.</li>
          <li>Items obtained through theft, fraud, or in violation of a third party's rights.</li>
          <li>Any listing that misstates batch code, production year, or remaining volume.</li>
        </ul>
        <p>
          Violation of this section may result in immediate delisting, account suspension, forfeiture of
          escrowed funds pending investigation, and referral to law enforcement where applicable.
        </p>
      </Section>

      <Section title="5. Pricing & Flat Platform Fee">
        <p>
          Sellers set their own listing price and may choose to accept offers below the listed price. A
          flat platform retainage fee of ₹100 INR is deducted from the seller's final sale price at the time escrow is
          released. dcltr.in does not charge percentage commission fees on sales; the flat ₹100 INR fee in effect at the time of sale will apply.
        </p>
      </Section>

      <Section title="6. Payments, Easebuzz Gateway & Escrow">
        <p>
          All payments on the Platform are processed through our RBI-authorized payment aggregator partner, <strong>Easebuzz</strong>.
          dcltr.in does not collect or store your card numbers, UPI PINs, or net-banking credentials. Escrow funds remain securely
          held during the 48-hour buyer inspection window, after which seller payouts (minus the flat ₹100 INR platform fee) are
          disbursed automatically via Easebuzz Wire (IMPS/UPI) directly to the seller's registered account.
        </p>
        <p>
          Funds paid by a buyer are held in escrow and are <strong>not</strong> released to the seller until
          the applicable inspection window (currently 48 hours from confirmed delivery, or as configured on
          the Platform) has elapsed without a valid dispute, or the buyer affirmatively confirms receipt and
          approves release. See our <strong>Refund &amp; Cancellation Policy</strong> for the full escrow,
          dispute, and refund process.
        </p>
      </Section>

      <Section title="7. Shipping & Delivery">
        <p>
          Sellers are responsible for securely packaging and dispatching sold items within the timeline
          specified on the Platform, and for providing valid courier tracking details. Please see our{' '}
          <strong>Shipping &amp; Delivery Policy</strong> for full details, including packaging and
          tamper-seal requirements.
        </p>
      </Section>

      <Section title="8. Cancellations, Returns & Refunds">
        <p>
          Order cancellation, return eligibility, and refund timelines are governed by our{' '}
          <strong>Refund &amp; Cancellation Policy</strong>, which forms part of these Terms.
        </p>
      </Section>

      <Section title="9. User Conduct">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Circumvent the Platform's escrow system to transact off-platform.</li>
          <li>Manipulate reviews, ratings, or offers, or engage in shill bidding.</li>
          <li>Harass, defraud, or misrepresent your identity to another user.</li>
          <li>Use the Platform for money laundering or any unlawful purpose.</li>
          <li>Upload malicious code or attempt to breach the Platform's security.</li>
        </ul>
      </Section>

      <Section title="10. Disputes & Grievance Resolution">
        <p>
          Order-level disputes (e.g., fluid level, authenticity, or damage claims) are arbitrated by our
          Admin Dispute Desk based on the evidence submitted by both parties, including seller pre-shipment
          weight/seal records and buyer inspection notes. The Admin's resolution regarding release or refund
          of escrowed funds is final and binding for the purposes of that transaction.
        </p>
        <p>
          For any other grievance regarding the Platform, you may contact our Grievance Officer as listed on
          our <strong>Contact Us</strong> page, in accordance with the Information Technology (Intermediary
          Guidelines and Digital Media Ethics Code) Rules, 2021.
        </p>
      </Section>

      <Section title="11. Intellectual Property">
        <p>
          The dcltr.in name, logo, and Platform design are the property of{' '}
          <strong>[Legal Entity Name]</strong>. Brand names, product images, and fragrance descriptions
          referenced on listings remain the property of their respective trademark owners and are used for
          identification purposes only.
        </p>
      </Section>

      <Section title="12. Limitation of Liability">
        <p>
          The Platform is provided on an "as-is" and "as-available" basis. To the fullest extent permitted
          by law, dcltr.in shall not be liable for indirect, incidental, or consequential damages arising
          from a transaction between a buyer and seller, except to the extent such loss arises directly from
          our own gross negligence or wilful default in operating the escrow process.
        </p>
      </Section>

      <Section title="13. Suspension & Termination">
        <p>
          dcltr.in may suspend or terminate any account that violates these Terms, provides false KYC
          information, or is subject to repeated verified disputes, with or without notice, and may withhold
          escrowed funds pending investigation of suspected fraud.
        </p>
      </Section>

      <Section title="14. Governing Law & Jurisdiction">
        <p>
          These Terms are governed by the laws of India. Subject to the dispute resolution process above,
          courts at <strong>[City], India</strong> shall have exclusive jurisdiction over any dispute arising
          out of or relating to these Terms.
        </p>
      </Section>

      <Section title="15. Changes to these Terms">
        <p>
          We may update these Terms periodically to reflect changes in our services or applicable law. The
          "Last Updated" date above will be revised accordingly; continued use of the Platform after changes
          are posted constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section title="16. Contact">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:support@dcltr.in" className="text-amber-800 font-bold hover:underline">
            support@dcltr.in
          </a>{' '}
          or via our <strong>Contact Us</strong> page.
        </p>
      </Section>
    </PolicyLayout>
  );
}
