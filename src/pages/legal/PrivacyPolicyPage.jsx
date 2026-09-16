import React from 'react';
import PolicyLayout, { Section, SubHeading } from '../../components/legal/PolicyLayout';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      tagline="How dcltr.in collects, uses, and protects your information"
      lastUpdated="September 14, 2026"
    >
      <Section title="1. Introduction">
        <p>
          This Privacy Policy explains how <strong>[Legal Entity Name]</strong>, operating dcltr.in (the
          "Platform", "we", "us"), collects, uses, discloses, and safeguards your information when you use
          our buyer marketplace, seller portal, and admin services. By using the Platform, you consent to
          the practices described here.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <SubHeading>Account & Identity Information</SubHeading>
        <p>Name, email address, phone number, delivery address, and profile photo/avatar.</p>
        <SubHeading>Seller KYC Information</SubHeading>
        <p>
          Government-issued ID type and number, payout details (UPI ID / bank account and IFSC), and
          business information, collected solely to verify seller identity and process payouts in line with
          anti-fraud and RBI guidelines.
        </p>
        <SubHeading>Transaction Data</SubHeading>
        <p>
          Listings created, offers made, orders placed, escrow status, shipment tracking numbers, parcel
          weight/seal records, dispute evidence, and review content.
        </p>
        <SubHeading>Payment Information</SubHeading>
        <p>
          Payments are processed by our third-party payment gateway partner. dcltr.in does <strong>not</strong>{' '}
          collect or store your full card number, CVV, UPI PIN, or net-banking credentials. We may receive a
          transaction reference, payment status, and last four digits of a payment instrument from our
          gateway partner for order reconciliation.
        </p>
        <SubHeading>Device & Usage Data</SubHeading>
        <p>
          IP address, browser type, device identifiers, pages viewed, and general usage analytics collected
          automatically and via cookies (see Section 6).
        </p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create and manage your buyer/seller/admin account.</li>
          <li>To process orders, escrow payments, payouts, and refunds.</li>
          <li>To verify seller identity (KYC) and prevent fraud or counterfeit listings.</li>
          <li>To facilitate shipping, delivery tracking, and dispute arbitration.</li>
          <li>To send transactional notifications (order, offer, payout, and dispute updates).</li>
          <li>To improve, secure, and personalize the Platform.</li>
          <li>To comply with legal, tax, and regulatory obligations.</li>
        </ul>
      </Section>

      <Section title="4. Sharing & Disclosure">
        <p>We share information only where necessary to operate the Platform:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>With the counterparty to a transaction</strong> — a buyer and seller can see each other's
            display name, rating, and shipping details required to complete an order.
          </li>
          <li>
            <strong>Payment gateway partner</strong> — to process payments and payouts securely.
          </li>
          <li>
            <strong>Courier / logistics partners</strong> — to arrange and track shipments.
          </li>
          <li>
            <strong>KYC / identity verification providers</strong> — to validate seller documentation.
          </li>
          <li>
            <strong>Law enforcement or regulators</strong> — where required by law, court order, or to
            investigate fraud.
          </li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </Section>

      <Section title="5. Cookies & Tracking">
        <p>
          The Platform uses cookies and browser local storage to keep you signed in, remember your cart,
          wishlist, and filter preferences, and to understand aggregate usage. You can control cookies
          through your browser settings; disabling them may limit some Platform functionality.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We retain account and transaction records for as long as your account is active and thereafter for
          as long as required to comply with tax, accounting, escrow-dispute, and anti-fraud recordkeeping
          obligations, after which the data is securely deleted or anonymized.
        </p>
      </Section>

      <Section title="7. Data Security">
        <p>
          We use industry-standard administrative, technical, and physical safeguards to protect your
          information, including encrypted transmission (HTTPS/TLS) and restricted internal access to KYC
          and payment records. No method of transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </Section>

      <Section title="8. Your Rights & Choices">
        <p>
          You may request access to, correction of, or deletion of your personal data, subject to our
          legitimate business and legal recordkeeping needs (for example, completed-order and escrow records
          may need to be retained for a statutory period). To exercise these rights, contact us using the
          details in Section 11.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          The Platform is not directed at individuals under 18 years of age, and we do not knowingly collect
          personal information from minors.
        </p>
      </Section>

      <Section title="10. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes will be reflected by
          updating the "Last Updated" date above.
        </p>
      </Section>

      <Section title="11. Grievance Officer & Contact">
        <p>
          In accordance with the Information Technology Act, 2000 and the Information Technology
          (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Officer for
          dcltr.in is:
        </p>
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono leading-relaxed">
          <div>Name: <strong>[Grievance Officer Name]</strong></div>
          <div>Designation: <strong>[Designation]</strong></div>
          <div>Email: <a href="mailto:grievance@dcltr.in" className="text-amber-800 font-bold hover:underline">grievance@dcltr.in</a></div>
          <div>Address: <strong>[Registered Business Address], India</strong></div>
        </div>
        <p>
          For general privacy questions, write to{' '}
          <a href="mailto:privacy@dcltr.in" className="text-amber-800 font-bold hover:underline">
            privacy@dcltr.in
          </a>
          .
        </p>
      </Section>
    </PolicyLayout>
  );
}
