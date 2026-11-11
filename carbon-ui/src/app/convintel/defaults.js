export const DEFAULTS = {
  free_form_text: `SCC Account Director: Good afternoon, this is Sophie Laurent from SCC. Am I speaking with Thomas Whitfield, Head of Platform Engineering at LSEG?

Client: Yes, speaking. Thanks for making time, Sophie.

SCC Account Director: Thank you, Thomas. As I mentioned in my email, I wanted to follow up on the proposal we sent your CTO about expanding your Confluent subscription through SCC. Can you tell me where things stand on your side?

Client: Sure. Today Confluent runs for the Markets Technology programme only. It works well, but every other division has built its own point-to-point integrations. Data and Analytics, FTSE Russell and Risk Intelligence all move data in different ways, and each new acquisition adds another set of pipelines.

SCC Account Director: That matches what we saw in public material. What is the biggest pain point right now?

Client: Two things. First, onboarding acquired data. After each deal we spend months building one-off ETL before customers see any value. Second, resilience. Our regulators expect us to show we can recover event flows quickly, and today that evidence is manual.

SCC Account Director: Understood. With a shared platform, a governed schema registry and managed connectors, we have seen onboarding cycles shorten significantly. We would size it with your team rather than promise a number. On the commercial side, would transitioning at your March renewal work?

Client: That is the natural point. The current contract is with the vendor directly. If SCC can co-term and guarantee no disruption to live services, I can take it to the CTO. Budget-wise we are looking at roughly 3 million pounds a year for the expanded scope, subject to the business case.

SCC Account Director: That is in line with what we modelled. Are you evaluating alternatives?

Client: We looked at running open source Apache Kafka ourselves and at a cloud provider's managed streaming service. Neither gives us the governance or the hybrid deployment flexibility we need, but procurement will want to see the comparison.

SCC Account Director: Fair. I will include a side-by-side in the proposal. Could we hold a 90-minute architecture and value session next Thursday?

Client: Thursday at 10:00 works well. I'll invite Priya from the risk side as well.

SCC Account Director: Excellent. I'll send a calendar invitation and a transition plan outline beforehand. Thank you for your time today, Thomas.

Client: Thank you, Sophie. Speak soon.`,
  entities: [
    { label: "Conversation Summary", definition: "A concise 2-3 sentence summary of the key points discussed in the conversation" },
    { label: "Industry Classification", definition: "The client's industry sector. Choose from: Finance, Manufacturing, Healthcare, Retail, Technology, Energy, Logistics, Education, Government, Other" },
    { label: "Call-to-Action", definition: "The primary next step or action required. Choose from: Send Proposal, Schedule Demo, Follow-up Call, Send Pricing, Technical Discussion, Contract Review, No Action Needed" },
    { label: "Client Name", definition: "Full name of the client contact person" },
    { label: "Client Company", definition: "Name of the client's organization" },
    { label: "Client Role", definition: "Job title or role of the client contact" },
    { label: "Budget Range", definition: "Stated or implied budget amount for the project" },
    { label: "Timeline", definition: "Expected implementation or decision timeline" },
    { label: "Key Pain Points", definition: "Main challenges or problems the client is trying to solve" },
    { label: "Competitors Mentioned", definition: "Any competing solutions or vendors mentioned" },
    { label: "", definition: "" } // optional spare row for the UI
  ]
};

// Tab 2: Multilingual Customer Service with Sentiment Analysis
// LSEG tailoring: German-language call to a Data & Analytics support desk about a delayed market data feed
export const SALES_CALL = {
  free_form_text: `Kundenservice: Guten Tag, hier ist Anna vom Data-&-Analytics-Support. Wie kann ich Ihnen heute helfen?

Kunde: Guten Tag. Mein Name ist Schmidt, ich bin Handelsleiter bei einer Frankfurter Vermögensverwaltung. Ich bin ehrlich gesagt sehr verärgert. Seit heute Morgen kommen die Kursdaten für unsere Handelsdesks mit mehreren Minuten Verzögerung an!

Kundenservice: Das tut mir sehr leid, Herr Schmidt. Das ist natürlich inakzeptabel, wenn Sie Handelsentscheidungen darauf stützen. Können Sie mir sagen, seit wann genau Sie das beobachten und welche Datenfeeds betroffen sind?

Kunde: Seit etwa 08:15 Uhr. Betroffen sind die Aktienkurse und die Indexwerte. Wir haben heute eine große Umschichtung geplant, und mein Team arbeitet praktisch blind. Das ist völlig inakzeptabel!

Kundenservice: Ich verstehe, das ist für Sie geschäftskritisch. Ich stufe das Ticket sofort als dringend ein und verbinde Sie mit meinem Kollegen Herrn Weber aus dem technischen Betrieb. Bitte bleiben Sie in der Leitung.

Kundenservice (Herr Weber): Guten Tag, Herr Schmidt, hier ist Weber. Wir haben die Ursache gefunden: Ein Verbraucher-Rückstau auf einem Ereignisstrom in unserem europäischen Rechenzentrum. Wir leiten Ihren Feed gerade auf den Ausweichcluster um. Die Daten sollten in etwa zehn Minuten wieder in Echtzeit laufen.

Kunde: Zehn Minuten sind lang, aber gut, dass es eine konkrete Lösung gibt. Und was ist mit den bereits verpassten Daten?

Kundenservice (Herr Weber): Alle Ereignisse wurden gespeichert und werden nach der Umleitung in der richtigen Reihenfolge nachgeliefert. Es geht nichts verloren. Für die Unannehmlichkeiten schreiben wir Ihnen außerdem die Gebühr für den heutigen Tag gut.

Kunde: Das ist sehr fair. Vielen Dank für Ihre schnelle Hilfe, Herr Weber. Und auch Danke an Anna, die mich sofort weitergeleitet hat. Ich war am Anfang sehr wütend, aber Sie haben das wirklich professionell gelöst.

Kundenservice (Anna): Sehr gerne, Herr Schmidt. Es tut uns nochmals leid für die Unannehmlichkeiten. Gibt es noch etwas, womit wir Ihnen helfen können?

Kunde: Nein, das war alles. Danke und einen schönen Tag noch!`,
  entities: [
    { label: "Conversation Summary (English)", definition: "A concise 2-3 sentence summary of the conversation in English, regardless of the original language" },
    { label: "Original Language", definition: "The primary language of the conversation. Choose from: English, German, French, Spanish, Italian, Dutch, Portuguese, Other" },
    { label: "Initial Sentiment", definition: "Customer's emotional state at the start. Choose from: Very Positive, Positive, Neutral, Frustrated, Angry, Very Angry" },
    { label: "Final Sentiment", definition: "Customer's emotional state at the end. Choose from: Very Positive, Positive, Neutral, Frustrated, Angry, Very Angry" },
    { label: "Sentiment Journey", definition: "Brief description of how sentiment changed during the conversation" },
    { label: "Urgency Level", definition: "Priority of the issue. Choose from: Critical, High, Medium, Low" },
    { label: "Issue Category", definition: "Type of problem. Choose from: Technical Outage, Performance, Billing, Account Access, Feature Request, General Inquiry, Other" },
    { label: "Resolution Status", definition: "Outcome of the conversation. Choose from: Resolved, Partially Resolved, Escalated, Pending Follow-up, Unresolved" },
    { label: "Customer Satisfaction", definition: "Implied satisfaction at end. Choose from: Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied" },
    { label: "Business Impact", definition: "Effect on customer's business operations" },
    { label: "Compensation Offered", definition: "Any credits, refunds, or compensation provided" },
    { label: "Follow-up Required", definition: "Whether additional follow-up is needed. Choose from: Yes, No" },
    { label: "", definition: "" } // optional spare row for the UI
  ]
};

// Tab 3: Meeting Intelligence & Action Items
// LSEG tailoring: internal architecture and value session on a shared streaming platform
export const SUPPORT_TICKET = {
  free_form_text: `Streaming Platform Architecture and Value Session - FY2027 Planning
Date: 12 November 2026, 10:00-11:30 AM GMT
Attendees: Thomas Whitfield (Head of Platform Engineering), Priya Raman (Head of Operational Resilience), Daniel Okafor (Data & Analytics Architect), Sophie Laurent (SCC Account Director)

Thomas Whitfield: Good morning everyone. Thanks for joining. Today we want to agree which expansion scenarios to take forward and what a no-disruption transition at the March renewal looks like. Daniel, where are we on the current Confluent estate?

Daniel Okafor: The Markets Technology programme runs about forty topics across two clusters. Data and Analytics is on a separate set of file-based feeds. We could move the index and reference data distribution onto the platform first, but we would need a schema governance model before we publish anything to more consumers.

Thomas Whitfield: That is the right order. Priya, from the resilience side, what do you need?

Priya Raman: Evidence. Our regulators expect us to show recovery time for critical event flows. Today that is gathered by hand after incidents. If the shared platform gives us replayable streams and a failover test we can run on a schedule, that is a real benefit. I would put post-trade and settlement visibility first.

Thomas Whitfield: Agreed. Sophie, can SCC support both while keeping live services untouched?

Sophie Laurent: Yes. We would baseline the current contract and usage first, co-term to the March date, and only add capacity for the scenarios you select. Support is UK-based, 24/7 for critical systems, with one escalation path into IBM and Confluent.

Daniel Okafor: One concern: connectors for the newly acquired data asset. If we reuse a repeatable pattern we avoid another set of one-off pipelines, but it needs a security review first.

Thomas Whitfield: Then the decision is: scenario two, real-time post-trade and settlement, goes first, and scenario three, acquired data onboarding, second. Scenario four, the AI-ready foundation, waits until governance is in place. Let me summarise the actions.

Thomas Whitfield: Daniel, document the current topic inventory and consumer groups by 20 November. Priya, define the recovery-time evidence requirements by 27 November. Sophie, send the co-term and transition plan outline by 24 November. I will take the scenario sizing to the CTO before the end of the month. And Daniel, please start the connector security review for the acquired data asset by 4 December.

Priya Raman: One open question: do we keep the second cluster self-managed or move it to a managed service? Cost and data residency will drive that.

Thomas Whitfield: Let's park that for the next session. When is it?

Sophie Laurent: I suggest 8 December at the same time, once the inventory and the evidence requirements are in.

Priya Raman: Sounds good. Thanks everyone!`,
  entities: [
    { label: "Meeting Summary", definition: "A concise 2-3 sentence summary of the meeting's key discussion points and outcomes" },
    { label: "Meeting Type", definition: "Category of meeting. Choose from: Planning, Review, Brainstorm, Decision-making, Status Update, Strategy, Other" },
    { label: "Key Decisions Made", definition: "List of important decisions reached during the meeting with brief context" },
    { label: "Action Item 1", definition: "First action item with format: 'Task description | Owner | Deadline'" },
    { label: "Action Item 2", definition: "Second action item with format: 'Task description | Owner | Deadline'" },
    { label: "Action Item 3", definition: "Third action item with format: 'Task description | Owner | Deadline'" },
    { label: "Action Item 4", definition: "Fourth action item with format: 'Task description | Owner | Deadline'" },
    { label: "Action Item 5", definition: "Fifth action item with format: 'Task description | Owner | Deadline'" },
    { label: "Open Questions", definition: "Topics or issues that require follow-up or further discussion" },
    { label: "Key Priorities", definition: "Top 2-3 priorities identified in the meeting" },
    { label: "Next Meeting", definition: "Date and agenda for the next meeting if mentioned" },
    { label: "Budget/Resource Concerns", definition: "Any budget, resource, or capacity issues discussed" },
    { label: "", definition: "" } // optional spare row for the UI
  ]
};

// Made with Bob
