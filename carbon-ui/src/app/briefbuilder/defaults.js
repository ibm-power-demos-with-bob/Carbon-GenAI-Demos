// LSEG tailoring: marketing briefs built around real-time data products, events and the SCC / IBM partner motion.
// All scenarios are illustrative and fictional.
export const DEFAULTS = {
  free_form_text: `Campaign request: Create a launch brief for a new product feature called Real-Time Index Stream.

Product details:
- Feature: Real-Time Index Stream
- Product: Index and reference data distribution service (FTSE Russell-style benchmark data)
- What it does: Publishes index levels, constituent changes and reference data as governed, replayable event streams that customers subscribe to, instead of waiting for end-of-day files
- Primary benefit: Gives asset managers, ETF issuers and trading desks index data when it changes, with a full replayable history for audit
- Launch type: Existing product feature launch
- Launch timing: Mid-March
- Target audience: Heads of data, index operations leads, and portfolio technology leaders at asset managers and ETF issuers
- Geography: UK, Europe and North America
- Differentiators:
  1. Publish once, serve many consumers, with schemas governed centrally
  2. Replayable streams that make audit and reconciliation simple
  3. Delivered through hybrid deployment options for regulated customers who need to control where data runs
- Customer pain points:
  1. Batch files that arrive hours after the market has moved
  2. Brittle point-to-point integrations with each internal system
  3. Manual reconciliation when index changes are corrected
  4. Pressure to evidence operational resilience to regulators

Tone and style:
- Tone: Confident, practical, business-focused
- Style: Clear, concise, enterprise B2B financial-services language
- Avoid: Hype, buzzwords, unsupported claims

Required output guidance:
- Emphasize business outcomes over technical detail
- Include a clear primary message and supporting proof points
- Make the CTA suitable for a feature launch campaign
- Assume this brief will be used by campaign, content, digital, and sales teams`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the campaign brief' },
    { label: 'Campaign Objective', definition: 'The primary business goal of the campaign in 1-2 sentences' },
    { label: 'Target Audience', definition: 'Who the campaign is for, including roles, segment, and geography' },
    { label: 'Key Message', definition: 'The single most important message the audience should remember' },
    { label: 'Supporting Messages', definition: 'Three short supporting proof points or sub-messages' },
    { label: 'Tone and Style Guidance', definition: 'Instructions describing the desired tone, style, and wording approach' },
    { label: 'Call to Action', definition: 'Primary CTA the campaign should drive' },
    { label: 'Channels and Assets', definition: 'Recommended channels/assets to activate for this brief' },
    { label: 'Success Measures', definition: 'Suggested KPIs or success metrics for the campaign' },
    { label: '', definition: '' },
  ],
};

export const EVENT_CAMPAIGN = {
  free_form_text: `Campaign request: Build an event campaign brief for our presence at a major financial markets technology conference in London.

Event details:
- Event: Financial Markets Data and Technology Forum (fictional example)
- Format: In-person industry conference with sponsorship booth and speaking session
- Date: 18-19 June
- Location: London
- Company goal: Generate qualified meetings and pipeline for our real-time data distribution and post-trade streaming solutions
- Audience: Chief data officers, heads of market data, post-trade technology leads, and operational resilience owners
- Main offer: Governed real-time data streaming across trading, clearing, index and risk workflows, deployable on hybrid infrastructure
- Business problem solved: Removes brittle point-to-point integrations and gives regulated firms replayable evidence of event flows
- Key differentiators:
  1. Hybrid and on-premises deployment options for regulated environments
  2. Fast onboarding of newly acquired data assets using repeatable connector patterns
  3. Works alongside existing platforms without a rip-and-replace
- Desired outcomes:
  1. Book executive meetings at the event
  2. Drive post-event architecture session requests
  3. Build awareness before the keynote session
- Available channels:
  1. Email
  2. LinkedIn paid and organic
  3. SDR outreach
  4. Landing page
  5. Event signage and booth messaging
- Tone: Senior, credible, outcome-driven
- Style: Executive B2B, direct, modern, no jargon overload`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the event campaign brief' },
    { label: 'Event Objective', definition: 'What the company needs to achieve before, during, and after the event' },
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
  free_form_text: `Campaign request: Create a partner enablement brief for the SCC and IBM joint motion to expand Confluent in financial services.

Partner details:
- Partner: SCC (IBM UK Platinum partner)
- Joint offer: Confluent subscription expansion through SCC, with assessment, delivery, UK-based 24/7 support and consumption governance
- Launch goal: Enable SCC sellers and IBM sellers to position the joint offer to capital markets and data providers, starting with a Chief Technology Officer audience
- Target audience: CTOs, heads of platform engineering, and operational resilience leaders at financial markets infrastructure firms
- Joint value proposition:
  1. One accountable UK partner across Confluent and the wider IBM portfolio
  2. Streaming that supports post-trade, data distribution and acquisition integration
  3. Governed, hybrid deployment suited to regulated firms
- Enablement needs:
  1. Clear positioning statement
  2. Sales talk track
  3. Campaign themes for partner outreach
  4. Recommended launch assets
- Constraints:
  1. Messaging must reflect both brands
  2. Claims must stay conservative and credible
  3. Output should be useful for internal enablement first, then adaptable for external use
- Tone: Collaborative, trusted-advisor, enterprise-ready
- Style: Concise, practical, partner-friendly, compliant
- Timing: Partner kickoff in two weeks`,
  entities: [
    { label: 'Brief Title', definition: 'A concise title for the partner enablement brief' },
    { label: 'Launch Objective', definition: 'The purpose of the joint launch and desired business outcome' },
    { label: 'Target Audience', definition: 'Who the partner motion should target and why they care' },
    { label: 'Joint Value Proposition', definition: 'A concise statement of the combined partner solution value' },
    { label: 'Positioning Guidance', definition: 'How the offer should be positioned by partner-facing teams' },
    { label: 'Partner Messaging Themes', definition: 'Three messaging themes partners can use in outreach and conversations' },
    { label: 'Recommended Assets', definition: 'Suggested enablement or campaign assets required for launch' },
    { label: 'Suggested CTA', definition: 'Best next step to ask of the audience' },
    { label: 'Execution Notes', definition: 'Important guidance, constraints, or coordination notes for launch execution' },
    { label: '', definition: '' },
  ],
};

// Made with Bob
