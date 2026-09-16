import React from 'react';
import PolicyLayout, { Section, SubHeading } from '../../components/legal/PolicyLayout';

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      tagline="How order cancellations, disputes, and refunds work on dcltr.in"
      lastUpdated="September 14, 2026"
    >
      <Section title="1. Overview">
        <p>
          Because dcltr.in is a peer-to-peer marketplace for pre-loved and partial fragrances, every order is
          protected by our <strong>escrow system</strong>: the buyer's payment is held securely by dcltr.in's
          payment gateway partner and is only released to the seller after the buyer's inspection window has
          passed without a valid dispute, or the buyer confirms the order is satisfactory.
        </p>
      </Section>

      <Section title="2. Order Cancellation">
        <SubHeading>Before Shipment</SubHeading>
        <p>
          A buyer may request cancellation of an order at any time before the seller uploads courier tracking
          and dispatch proof. If the seller has not yet shipped the item, the full amount is refunded to the
          buyer's original payment method.
        </p>
        <SubHeading>After Shipment</SubHeading>
        <p>
          Once a seller has dispatched an order and uploaded tracking details, the order cannot be cancelled
          outright; the buyer may instead raise a dispute after delivery if the item does not match the
          listing (see Section 4).
        </p>
      </Section>

      <Section title="3. The 48-Hour Inspection Escrow Window">
        <p>
          Once an order is marked "delivered," the buyer has an inspection window (48 hours by default, or as
          configured on the Platform) to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Verify the batch code stamp against the listing.</li>
          <li>Verify the fluid meniscus / remaining volume against the listed amount.</li>
          <li>Inspect the atomizer, cap, and packaging for damage or tampering.</li>
        </ul>
        <p>
          If the buyer approves the order, or the window elapses without a dispute being filed, escrow funds
          are released to the seller (net of the applicable platform commission).
        </p>
      </Section>

      <Section title="4. Eligible Grounds for a Dispute / Refund">
        <p>You may file a dispute within the inspection window if:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The remaining fluid level is materially lower than what was listed.</li>
          <li>The batch code on the physical bottle does not match the listing.</li>
          <li>The item shows signs of formulation alteration, dilution, or is suspected counterfeit.</li>
          <li>The item arrived damaged, or the atomizer/cap is broken or missing when listed as present.</li>
          <li>The item received is materially different from its listing description or photos.</li>
        </ul>
        <p>
          To file a dispute, go to <strong>My Escrow Orders → Report Issue / Dispute</strong>, select a
          reason, and provide your measured parcel weight and any supporting notes/photos.
        </p>
      </Section>

      <Section title="5. Dispute Arbitration">
        <p>
          Once a dispute is filed, the escrow funds are immediately frozen and the order is routed to our
          Admin Dispute Desk. Admin compares the seller's pre-shipment manifest (declared parcel weight and
          tamper-seal ID, logged before dispatch) against the buyer's inspection claim and evidence, and
          issues a binding verdict:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Refund to Buyer</strong> — full escrowed amount is refunded to the buyer's original payment method.</li>
          <li><strong>Release to Seller</strong> — escrow is released to the seller's wallet as normal.</li>
        </ul>
      </Section>

      <Section title="6. Refund Timeline">
        <p>
          Approved refunds are initiated to the buyer's original payment method (card, UPI, or net banking)
          through our payment gateway partner. Refunds typically reflect in <strong>5–10 business days</strong>,
          depending on your bank or payment provider's processing time; dcltr.in does not control this
          timeline once the refund has been initiated by the gateway.
        </p>
      </Section>

      <Section title="7. Non-Refundable Situations">
        <ul className="list-disc pl-5 space-y-1">
          <li>Requests raised after the inspection window has closed without a filed dispute.</li>
          <li>Change of mind after the item has been received and approved.</li>
          <li>Damage or discrepancy caused by the buyer's own use, storage, or handling after delivery.</li>
          <li>Fragrance sensitivity, scent preference, or subjective dissatisfaction with the perfume itself, where the item matches the listing.</li>
        </ul>
      </Section>

      <Section title="8. Seller Payouts">
        <p>
          Once escrow is released to a seller, funds are credited to the seller's Platform wallet balance.
          Sellers may request a withdrawal (via UPI or bank transfer/NEFT) which is processed after admin
          approval, as described in the Seller Command Center.
        </p>
      </Section>

      <Section title="9. Contact for Refund Queries">
        <p>
          For help with a specific order, use the <strong>Report Issue / Dispute</strong> flow in{' '}
          <strong>My Escrow Orders</strong>, or contact{' '}
          <a href="mailto:support@dcltr.in" className="text-amber-800 font-bold hover:underline">
            support@dcltr.in
          </a>{' '}
          referencing your Order ID.
        </p>
      </Section>
    </PolicyLayout>
  );
}
