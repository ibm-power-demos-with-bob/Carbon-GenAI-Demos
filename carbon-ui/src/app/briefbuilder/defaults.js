export const DEFAULTS = {
  free_form_text: `Campaign request: Create a launch brief for a new supplier onboarding programme called FastTrack Supplier Connect.

Programme details:
- Programme name: FastTrack Supplier Connect
- What it does: Streamlines the onboarding journey for new component suppliers, reducing time-to-catalogue from an average of 12 weeks to under 3 weeks using AI-assisted data validation and automated compliance checks
- Primary benefit: Gets new products in front of engineers faster while reducing manual effort for the supplier management team
- Launch type: New internal programme with external supplier-facing communications
- Launch timing: Q3
- Target audience: Supplier relationship managers, procurement leads, and new supplier contacts at component manufacturers across Europe and Asia-Pacific
- Geography: EMEA and APAC
- Differentiators:
  1. AI-assisted part number and datasheet validation reduces manual checking by 80%
  2. Automated RoHS and REACH compliance screening built into the workflow
  3. Suppliers get real-time visibility of their onboarding status through a self-service portal
- Customer pain points:
  1. Long onboarding cycles delay time-to-market for new product ranges
  2. Manual data entry errors cause catalogue quality issues
  3. Compliance documentation backlogs create regulatory risk
  4. Supplier frustration with lack of visibility into onboarding progress

Tone and style:
- Tone: Confident, efficient, partnership-focused
- Style: Clear, concise, B2B operational language
- Avoid: Hype, buzzwords, unsupported claims

Required output guidance:
- Emphasize speed, accuracy, and supplier experience outcomes
- Include a clear primary message and supporting proof points
- Make the CTA suitable for an internal programme launch with external supplier communications
- Assume this brief will be used by procurement, marketing, and supplier management teams`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the campaign brief' },
    { label: 'Campaign Objective', definition: 'The primary business goal of the programme in 1-2 sentences' },
    { label: 'Target Audience', definition: 'Who the campaign is for, including roles, segment, and geography' },
    { label: 'Key Message', definition: 'The single most important message the audience should remember' },
    { label: 'Supporting Messages', definition: 'Three short supporting proof points or sub-messages' },
    { label: 'Tone and Style Guidance', definition: 'Instructions describing the desired tone, style, and wording approach' },
    { label: 'Call to Action', definition: 'Primary CTA the programme launch should drive' },
    { label: 'Channels and Assets', definition: 'Recommended channels and assets to activate for this brief' },
    { label: 'Success Measures', definition: 'Suggested KPIs or success metrics for the programme launch' },
    { label: '', definition: '' },
  ],
};

export const EVENT_CAMPAIGN = {
  free_form_text: `Campaign request: Build an event campaign brief for Farnell's presence at electronica 2024 in Munich.

Event details:
- Event: electronica 2024
- Format: In-person industry trade show with exhibition stand and sponsored engineering session
- Date: 12-15 November 2024
- Location: Munich, Germany
- Company goal: Generate qualified meetings and pipeline for Farnell's industrial and automotive component ranges, and drive registrations for the Element14 engineering community
- Audience: Design engineers, hardware developers, procurement managers, and electronics innovation leads at OEMs, EMS providers, and R&D teams
- Main offer: Access to over 2 million stocked components with next-day delivery, engineering tools, and the Element14 design community
- Business problem solved: Engineers need components quickly during prototype and design phases — long lead times and poor catalogue data slow innovation
- Key differentiators:
  1. Same-day despatch on over 500,000 products
  2. Parametric search and datasheet access for faster design decisions
  3. Element14 community for peer knowledge, design resources, and technical support
- Desired outcomes:
  1. Book qualified meetings with procurement and engineering leads at the event
  2. Drive post-event Element14 community registrations
  3. Build awareness of Farnell's industrial and automotive component ranges
- Available channels:
  1. Email to registered attendees pre-event
  2. LinkedIn paid and organic
  3. Event signage and stand messaging
  4. SDR outreach to target accounts
  5. Post-event follow-up sequence
- Tone: Knowledgeable, engineering-credible, practical
- Style: Direct, technical B2B, focused on engineer needs`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the event campaign brief' },
    { label: 'Event Objective', definition: 'What Farnell needs to achieve before, during, and after the event' },
    { label: 'Audience and Personas', definition: 'Key event audience segments and buyer personas to target' },
    { label: 'Core Event Message', definition: 'Primary campaign message for the event audience' },
    { label: 'Pre-Event Plan', definition: 'Recommended actions and messaging before the event' },
    { label: 'At-Event Plan', definition: 'Recommended engagement approach during the event' },
    { label: 'Post-Event Follow-Up', definition: 'Suggested follow-up sequence and CTA after the event' },
    { label: 'Content and Asset Needs', definition: 'Key assets required to execute the event campaign' },
    { label: 'Success Measures', definition: 'Suggested KPIs to evaluate event campaign performance' },
    { label: '', definition: '' },
  ],
};

export const PARTNER_ENABLEMENT = {
  free_form_text: `Campaign request: Create a partner enablement brief for a joint solution launch with a key semiconductor manufacturer partner.

Partner details:
- Partner: A leading semiconductor manufacturer (tier-1 global supplier)
- Joint offer: Co-branded design-in support programme combining the manufacturer's reference designs with Farnell's component availability, rapid fulfilment, and Element14 community engineering resources
- Launch goal: Enable the manufacturer's regional sales and FAE teams to position the joint programme to design engineers and hardware developers across EMEA
- Target audience: Design engineers, hardware architects, and procurement leads at OEMs, EMS providers, and university R&D teams
- Joint value proposition:
  1. Faster design-to-prototype cycle with immediate component availability
  2. Technical support from both manufacturer FAEs and the Element14 community
  3. Simplified procurement path from prototype through to volume production
- Enablement needs:
  1. Clear joint positioning statement
  2. Sales talk track for manufacturer FAE teams
  3. Campaign themes for co-branded outreach
  4. Recommended launch assets
- Constraints:
  1. Messaging must reflect both brands equally
  2. Claims must stay conservative and credible — no unverified performance claims
  3. Output should be useful for internal enablement first, then adaptable for external co-marketing use
- Tone: Collaborative, technically credible, engineer-friendly
- Style: Concise, practical, co-brand ready
- Timing: Partner kick-off meeting in three weeks`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the partner enablement brief' },
    { label: 'Launch Objective', definition: 'The purpose of the joint programme and desired business outcome' },
    { label: 'Target Audience', definition: 'Who the partner motion should target and why they care' },
    { label: 'Joint Value Proposition', definition: 'A concise statement of the combined partner programme value' },
    { label: 'Positioning Guidance', definition: 'How the offer should be positioned by partner-facing teams' },
    { label: 'Partner Messaging Themes', definition: 'Three messaging themes partners can use in outreach and conversations' },
    { label: 'Recommended Assets', definition: 'Suggested enablement or campaign assets required for launch' },
    { label: 'Suggested CTA', definition: 'Best next step to ask of the audience' },
    { label: 'Execution Notes', definition: 'Important guidance, constraints, or coordination notes for launch execution' },
    { label: '', definition: '' },
  ],
};

// Made with Bob
