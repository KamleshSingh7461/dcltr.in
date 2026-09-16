import React from 'react';
import PolicyLayout, { Section, SubHeading } from '../../components/legal/PolicyLayout';

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      tagline="How orders are packaged, dispatched, and tracked on dcltr.in"
      lastUpdated="September 14, 2026"
    >
      <Section title="1. Overview">
        <p>
          dcltr.in is a peer-to-peer marketplace — every order is packaged and shipped directly by the
          individual seller, not by dcltr.in. This policy explains the packaging, dispatch, and delivery
          standards every seller agrees to follow, and what to expect as a buyer.
        </p>
      </Section>

      <Section title="2. Shipping Timelines">
        <p>
          Sellers are expected to dispatch an order and upload courier tracking details within{' '}
          <strong>24–48 hours</strong> of the order being placed and escrow being secured. Actual delivery
          time depends on the courier and destination, and is typically <strong>2–7 business days</strong>{' '}
          domestically.
        </p>
      </Section>

      <Section title="3. Shipping Charges">
        <p>
          Shipping cost, if any, is shown per listing at checkout and is set by the seller. Many listings on
          the Platform include free/insured shipping; where a charge applies, it is added to your order total
          before payment.
        </p>
      </Section>

      <Section title="4. Packaging & Tamper-Seal Requirements">
        <p>Before dispatch, sellers are required to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Securely package the flacon to prevent breakage or leakage in transit.</li>
          <li>Record the exact parcel weight in grams on a calibrated scale.</li>
          <li>Affix a tamper-evident security seal and log its unique seal ID on the Platform.</li>
          <li>Upload the courier name and tracking number before the order is dispatched.</li>
        </ul>
        <p>
          These pre-shipment records are used to protect both parties in the event of a delivery dispute (see
          our <strong>Refund &amp; Cancellation Policy</strong>).
        </p>
      </Section>

      <Section title="5. Tracking & Delivery Confirmation">
        <p>
          Once a seller uploads dispatch details, you can track your order status from{' '}
          <strong>My Escrow Orders</strong>. When the courier confirms delivery, your order moves to
          "Delivered — Inspecting," starting your inspection window.
        </p>
      </Section>

      <Section title="6. Lost, Delayed, or Damaged-in-Transit Parcels">
        <p>
          If a parcel is significantly delayed, lost, or arrives visibly damaged, please raise a dispute from{' '}
          <strong>My Escrow Orders</strong> immediately (or before your inspection window closes) so our
          Admin Dispute Desk can investigate using the courier's tracking data and the seller's pre-shipment
          manifest.
        </p>
      </Section>

      <Section title="7. Domestic & International Shipping">
        <p>
          dcltr.in currently facilitates shipping within India via the seller's chosen courier partner.
          Cross-border shipping of fragrances is subject to each courier's and destination country's customs
          regulations on liquids/alcohol-based products and is handled at the seller's discretion; buyers
          should confirm feasibility with the seller before placing an international order.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          For shipping-related questions on a specific order, contact the seller directly through the order
          thread, or reach our support team at{' '}
          <a href="mailto:support@dcltr.in" className="text-amber-800 font-bold hover:underline">
            support@dcltr.in
          </a>
          .
        </p>
      </Section>
    </PolicyLayout>
  );
}
