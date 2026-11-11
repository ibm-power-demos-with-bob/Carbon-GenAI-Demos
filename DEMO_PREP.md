# LSEG Demo Prep — 18 Use Case Briefing Cards

Open on a second monitor. Companion to [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md). All sample data is fictional; the pre-loaded text is already in each tab, so "input" below says what is pre-loaded and what to expect.

**Architecture in one breath (4 services):** `llama-server :8080` (Granite 4.0 Micro, the model) → `Node proxy :3001` (CORS, resolves host at runtime) → `Next.js + Carbon UI :3000` (the demo) · `PassportEye OCR :5000` (optional, soft-fail; only Passport Verification needs it).
*Remove the model: nothing answers. Remove the proxy: browser is blocked by CORS. Remove the UI: no demo. Remove OCR: only the passport image upload fails.*

**Bridge to the CTO proposal:** LSEG's estate is an event estate (Confluent). This demo is the private AI layer *around* those events. It does not connect to Confluent.

Priority for this audience: ★ = lead with it, ○ = if time, ✕ = anchor (unchanged), skip unless asked.

---

## Page 1 — Entity Extraction

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 1 | **Subscription Summary** · Entity Extraction → Subscription Summary | ○ | Internal note on Confluent Platform, SCC transition, GBP 1.8m now / 3.2m expanded, renewal 31 Mar 2027, contact Priya Raman | 7 fields: platform, current vendor relationship, proposed partner, current value, expanded value, renewal date, contact | CTO, procurement | "This is the note your team writes before a renewal; watch it become structured data." |
| 2 | **IT Ops Email** · Entity Extraction → IT Ops Email (toggle FR / IT) | ★ | FR: LCH SA clearing stream broker quorum loss. IT: Borsa Italiana analyst, stalled FTSE MIB end-of-day topic | English summary, sender, area, system, error code/message, impact, **True Priority**. FR → Critical, IT → Medium | Head of Resilience, platform eng | "Same model, two emails: one is a real settlement risk, one is panic with no customer impact." |
| 3 | **Quote Email** (anchor) · Entity Extraction → Quote Email | ✕ | German logistics quote (Hans Geis reference), unchanged | Extracted dimensions, pallet calculation | Anyone asking for numeric reasoning | "A real IBM customer scenario; it tests arithmetic, not just extraction." |

## Page 2 — PII Extraction

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 4 | **Fraud Complaint** · PII → Fraud Complaint | ★ | Complaint from "Sophie Müller" about a company card charge, with name, phone, email, card number | 8 fields: name, email, phone, card number, amount, transaction location/date, person location, plus redaction | DPO, CISO, KYC | "Names and card numbers: exactly what should never reach a public API." |
| 5 | **Passport Verification** (anchor) · PII → Passport Verification | ✕ | MRZ data for a sample passport, unchanged | Structured identity record | KYC / onboarding | "OCR text becomes a structured identity record, locally." |
| 6 | **Document Discovery** · PII → Document Discovery | ★ | Acquired-data onboarding memo: 125,000 subscriber records, 89,000 newsletter subscribers, named staff, emails, phones | Persons, emails, phones, roles, offices, dates, record counts | Data & Analytics, DPO, M&A integration | "After each acquisition you inherit documents like this; find where the personal data is before you publish to shared streams." |

## Page 3 — Brief Builder

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 7 | **Product Launch Brief** | ○ | Real-Time Index Stream launch (replayable index data for asset managers/ETF issuers), mid-March | 9-section campaign brief: objective, audience, key message, 3 proof points, CTA, channels, KPIs | FTSE Russell marketing | "Rough notes in, a brief your campaign, content and sales teams can use out." |
| 8 | **Event Campaign Brief** | ○ | Financial Markets Data and Technology Forum, London, 18-19 June | Pre-event / at-event / post-event plan, assets, KPIs | Marketing, SCC/IBM events | "One request, a whole event plan." |
| 9 | **Partner Enablement Brief** | ★ | SCC + IBM joint motion to expand Confluent in financial services | Positioning, 3 messaging themes, assets, CTA, constraints | SCC and IBM sellers | "This is the brief that would equip SCC and IBM sellers for the motion in your proposal." |

## Page 4 — RFP Assistant

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 10 | **Opportunity Matching** | ○ | SCC/IBM profile vs "Shared Streaming Platform Expansion", £9.6M / 3 yrs | Fit summary, Bid / Bid with Conditions / No-Bid, 3 win themes, risks, exec summary, next steps | Bid teams | "Should we bid, and how do we position it?" |
| 11 | **Proposal Drafting** | ○ | "Digital Settlement Platform: Real-Time Post-Trade Event Layer", £5M | Proposal framework: title, exec summary, solution, phased delivery, differentiators | Post-trade, DiSH-style programmes | "A first draft framework a bid team can start from." |
| 12 | **Exec Summary & Compliance Matrix** | ○ | "Risk Intelligence Screening Platform", £6.5M, 5 mandatory requirements | Executive summary + 4-row compliance matrix | Risk Intelligence, compliance | "Mandatory requirements answered in a matrix, not a wall of text." |

## Page 5 — Talent Acquisition

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 13 | **Job Requisition / Job Description Generation** | ○ | Senior Streaming Solutions Architect (Financial Markets), London hybrid | Polished JD: summary, responsibilities, qualifications, D&I, benefits, CTA | HR, hiring managers | "A requisition becomes a job description in seconds." |
| 14 | **Resume Search & Candidate Summaries** | ○ | Four fictional candidates, search for streaming/AI/hybrid architects | Per-candidate summary, best matches, search tags | HR, delivery leads | "Candidate data is personal data; it stays on Power." |
| 15 | **Candidate Shortlist / Interview Pack** | ○ | Three shortlisted fictional candidates | Recommendation, per-candidate assessment, interview focus and questions, risks | Hiring panel | "A structured interview pack, with the gaps called out honestly." |

## Page 6 — Conversation Intelligence

| # | Use case · tab | ★ | Pre-loaded input | What the model returns | Resonates with | Say before they type |
|---|---|---|---|---|---|---|
| 16 | **Sales Intelligence** | ★ | SCC–LSEG discovery call: Confluent on Markets Technology only; acquired-data and resilience pain; ~£3M/yr; March renewal | Summary, industry (Finance), CTA, client, role, budget, timeline, pain points, competitors (open-source Kafka, cloud managed streaming) | CTO, procurement | "Your own conversation, turned into pipeline fields." |
| 17 | **Multilingual Support** | ★ | German call: trading-desk head angry about delayed price data, escalated, resolved, fee credited | English summary, initial vs final sentiment, urgency, category, resolution, compensation | Data & Analytics support | "Native-speaker QA without a native speaker, and no call recordings leave the building." |
| 18 | **Meeting Intelligence** | ★ | Architecture and value session: scenario order, 5 dated actions, next meeting 8 Dec | Decisions, 5 action items (task \| owner \| deadline), open questions, priorities | Platform eng, CTO | "The session we're proposing, captured as decisions and owners." |

---

## Pre-flight checklist (10 minutes before)

- [ ] IBM VPN active; `http://<fqdn>:3000` loads
- [ ] Home page headline reads "Private GenAI for LSEG's data and streaming estate, on IBM Power"
- [ ] Run **IT Ops Email (FR)** once; confirm **Critical**. Run **(IT)**; confirm **Medium**
- [ ] Run **Sales Intelligence**; confirm budget ≈ £3M and both competitors are found
- [ ] `curl http://localhost:8080/health` and `:3001/health` return ok on the server

## Do not claim

- That this demo connects to Confluent or to LSEG systems
- Any figure here as LSEG's own (all invented)
- Production readiness; this is a single reserved demo instance
