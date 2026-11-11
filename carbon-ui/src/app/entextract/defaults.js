// LSEG tailoring: tab 1 is a subscription / vendor-notice extraction (all data synthetic)
export const DEFAULTS = {
  free_form_text: `Subject: Streaming platform subscription - expansion and renewal summary

Hello team. Quick summary ahead of Thursday's architecture and value session. The streaming platform in question is
Confluent Platform, now an IBM company since the completion of the acquisition in March 2026. Our current subscription
covers the Markets Technology programme only and is held directly with the vendor. The annual value is 1.8 million pounds
(GBP 1,800,000) on a three year term that ends on 31 March 2027.

The proposal from SCC, IBM's UK Platinum partner, would transition the subscription to SCC at renewal and extend it to
Data & Analytics, FTSE Russell and Risk Intelligence. The indicative expanded annual value is 3.2 million pounds. The
platform is self-managed on our own infrastructure, written to the existing hybrid estate, with 24/7 UK-based support.
The programme sponsor is the Chief Technology Officer. Please send questions to Priya Raman, Head of Platform Engineering,
before the session.`,
  entities: [
    { label: "Platform",        definition: "The name of the streaming platform or product being discussed." },
    { label: "Current Vendor Relationship", definition: "Who the subscription is currently held with." },
    { label: "Proposed Partner", definition: "The reseller or partner proposed to hold the expanded subscription." },
    { label: "Current Annual Value", definition: "The current annual subscription value, including currency." },
    { label: "Expanded Annual Value", definition: "The indicative expanded annual subscription value, including currency." },
    { label: "Renewal Date", definition: "The date the current subscription term ends." },
    { label: "Contact", definition: "The named person to send questions to, with their role." },
    { label: "",                definition: "" } // optional spare row for the UI
  ]
};
