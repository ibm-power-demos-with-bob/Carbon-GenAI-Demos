// LSEG tailoring: the bidder is SCC / IBM; opportunities are illustrative LSEG-style programmes. All fictional.
export const DEFAULTS = {
  free_form_text: `COMPANY PROFILE
Company name: SCC, working with IBM
Company description: UK IBM Platinum partner delivering IBM hybrid cloud, data, AI and Confluent streaming solutions with UK-based 24/7 support.
Core strengths:
- Hybrid cloud and integration expertise
- Streaming data and AI platforms for regulated environments
- Security, resilience, and governance capabilities
- Pre- and post-sales delivery with dedicated IBM specialists
Preferred deal profile:
- Multi-year platform expansions with consumption governance
- Mission-critical infrastructure and data modernization
- Regulated financial markets buyers

RFP OPPORTUNITY
Opportunity title: Global Markets Infrastructure Group - Shared Streaming Platform Expansion (illustrative)
Buyer: Global Markets Infrastructure Group
Sector: Financial markets infrastructure
Contract value: £9.6M over 3 years
Submission deadline: 30 June
Scope summary:
The group is seeking a partner to expand an existing streaming platform subscription from one programme to four divisions. The solution must support hybrid deployment, integrate with existing data distribution and post-trade systems, provide strong governance and resilience evidence, and include transition, delivery, and managed support services.
Key requirements:
1. Hybrid or self-managed deployment model
2. Integration with existing market data, clearing and risk systems
3. Governed schemas, auditability, and role-based access control
4. Transition at renewal with no disruption to live services
5. Delivery capability across architecture, implementation, and 24/7 support
Evaluation criteria:
- Technical fit 35%
- Resilience and compliance 25%
- Delivery capability 20%
- Commercial value 20%

TASK
Review this opportunity and generate a polished response pack that helps a bid team decide whether to pursue and how to position the proposal.`,
  entities: [
    { label: 'Opportunity Fit Summary', definition: 'A concise assessment of why this RFP is or is not a good fit for the company profile' },
    { label: 'Bid / No-Bid Recommendation', definition: 'A clear recommendation with brief rationale: Bid, Bid with Conditions, or No-Bid' },
    { label: 'Key Win Themes', definition: 'Three strategic themes that should anchor the proposal positioning' },
    { label: 'Risks and Gaps', definition: 'Important risks, capability gaps, or questions that must be addressed before bidding' },
    { label: 'Suggested Executive Summary', definition: 'A polished proposal-style executive summary for this RFP' },
    { label: 'Recommended Next Steps', definition: 'Practical bid team actions to progress the opportunity' },
    { label: '', definition: '' },
  ],
};

export const PROPOSAL_DRAFTING = {
  free_form_text: `COMPANY PROFILE
Company name: SCC, working with IBM
Company description: UK IBM Platinum partner offering hybrid cloud, streaming data, AI and managed services to regulated enterprises.
Relevant capabilities:
- Confluent streaming platform delivery and support
- Application and data modernization
- AI and automation services on IBM watsonx
- Managed infrastructure services
- Consulting-led transformation programmes

RFP OPPORTUNITY
Opportunity title: Digital Settlement Platform - Real-Time Post-Trade Event Layer (illustrative)
Buyer: Digital Settlement Platform Operator
Sector: Financial markets infrastructure
Contract value: £5M over 3 years
Submission deadline: 12 July
Business challenge:
The operator wants a real-time event layer that gives a consolidated view of trades, market data and reference data across clearing and settlement. The selected partner must design the target architecture, deliver ISO 20022-aligned event streams, improve resilience, and support future AI-enabled monitoring.
Required scope:
1. Discovery and current-state assessment
2. Streaming target architecture across hybrid infrastructure
3. Migration roadmap with phased implementation
4. Security, schema governance and operational resilience model
5. Managed services and ongoing optimization
Buyer priorities:
- Minimize disruption to live settlement operations
- Achieve measurable resilience and visibility gains
- Establish a scalable platform for future innovation
- Work with a partner that can deliver both strategy and execution

TASK
Generate a polished proposal draft framework that a bid team could use as the basis for a submission.`,
  entities: [
    { label: 'Proposal Title', definition: 'A professional title for the proposal document' },
    { label: 'Executive Summary', definition: 'A concise and polished executive summary for the proposal' },
    { label: 'Client Challenges', definition: 'Summary of the buyer challenges and business drivers' },
    { label: 'Proposed Solution', definition: 'A high-level solution overview aligned to the RFP requirements' },
    { label: 'Delivery Approach', definition: 'Suggested phased delivery model and implementation approach' },
    { label: 'Differentiators', definition: 'Key reasons the company should be selected over alternatives' },
    { label: 'Commercial Positioning', definition: 'How to frame value, efficiency, and commercial credibility' },
    { label: 'Call to Action', definition: 'Strong closing statement for the proposal' },
    { label: '', definition: '' },
  ],
};

export const EXEC_SUMMARY_COMPLIANCE = {
  free_form_text: `COMPANY PROFILE
Company name: SCC, working with IBM
Company description: We provide AI, streaming data, automation, and managed services for regulated organizations.
Relevant experience:
- Real-time data streaming and event-driven integration
- Data governance and security
- Financial services transformation
- Enterprise integration and managed services

RFP OPPORTUNITY
Opportunity title: Risk Intelligence Screening Platform - Real-Time Event Correlation (illustrative)
Buyer: Risk Intelligence Screening Business
Sector: Financial services
Contract value: £6.5M over 3 years
Submission deadline: 20 July
Programme objective:
The business wants a secure real-time platform that correlates screening events with historical patterns to support KYC, sanctions and due diligence workflows. The platform must support streaming ingestion, anomaly detection, workflow routing, and auditable controls for regulated use cases.
Mandatory requirements:
1. Strong governance and audit trail capabilities
2. Secure deployment and role-based access
3. Integration with core screening and case management systems
4. Support for high-volume, low-latency event processing
5. Implementation services, training, and operational support
Preferred capabilities:
- AI-assisted anomaly detection
- Human-in-the-loop review
- Analytics and reporting
- Scalable architecture for additional use cases

TASK
Generate an executive summary and a concise compliance-style response matrix for the opportunity.`,
  entities: [
    { label: 'Executive Summary', definition: 'A polished summary suitable for the opening of the proposal' },
    { label: 'Client Objectives', definition: 'The client goals and programme outcomes the response should emphasize' },
    { label: 'Proposed Response Strategy', definition: 'How the proposal should position the supplier response' },
    { label: 'Compliance Matrix - Governance', definition: 'A concise response to the governance and audit requirement' },
    { label: 'Compliance Matrix - Security', definition: 'A concise response to the secure deployment and access control requirement' },
    { label: 'Compliance Matrix - Integration', definition: 'A concise response to the integration requirement' },
    { label: 'Compliance Matrix - Delivery and Support', definition: 'A concise response to the implementation, training, and support requirement' },
    { label: 'Proof Points to Highlight', definition: 'Relevant proof points, capabilities, or experience to emphasize' },
    { label: '', definition: '' },
  ],
};

// Made with Bob
