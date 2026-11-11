# LSEG Demo Script — IBM Power GenAI (Private Granite AI)

**Audience:** LSEG Chief Technology Officer, plus Head of Platform Engineering, Head of Operational Resilience, Data & Analytics architects.
**Context:** Companion to the "Expanding Confluent through SCC" CTO proposal (prepared 2 November 2026). Confluent is now part of IBM (completed 17 March 2026). SCC is IBM's UK Platinum partner.
**Branch:** `lseg-demo` (local, never merged to `main`). All sample data is fictional.

> **Honest framing.** This demo shows IBM Granite running on IBM Power, with no data leaving the environment. It is *not* a Confluent demo and does not connect to a Confluent cluster. The bridge is narrative: LSEG's estate is an event estate; Power-hosted GenAI is the private intelligence layer that reads the text, calls and documents *around* those events. Do not claim the demo shows Confluent running.

---

## The one-line story

> "Confluent moves LSEG's events. IBM Power, running IBM Granite, lets you understand the text around those events — incident emails, client calls, bid documents, acquisition memos — without a single byte leaving your boundary. SCC is the one accountable UK partner for both."

## Suggested order (about 25 minutes)

| # | Tab | Why for this audience | Time |
|---|---|---|---|
| 1 | Home | Frame: private, no cloud API, resilience first | 1 min |
| 2 | Entity Extraction → **IT Ops Email** (French) | LCH SA clearing stream failure. Priority must be **Critical**. Speaks to the resilience owner. | 4 min |
| 3 | Entity Extraction → **IT Ops Email** (Italian toggle) | Same model, emotional email, priority must stay **Medium**. Shows judgement, not keyword matching. | 2 min |
| 4 | Entity Extraction → **Subscription Summary** | Their own commercial world: platform, partner, GBP values, renewal date, contact. | 2 min |
| 5 | Conversation Intelligence → **Sales Intelligence** | The SCC-to-LSEG call. Budget, timeline, pain points, competitors (open-source Kafka, cloud managed streaming). | 3 min |
| 6 | Conversation Intelligence → **Multilingual Support** | German trading-desk call about a delayed feed. Sentiment journey angry → satisfied. | 3 min |
| 7 | Conversation Intelligence → **Meeting Intelligence** | Architecture and value session turned into decisions and owned actions. | 3 min |
| 8 | PII → **Fraud Complaint** + **Document Discovery** | KYC / data-protection angle. Acquisition-onboarding memo with 125,000 records. | 4 min |
| 9 | Client drives | CTO or architect pastes their own (non-sensitive) text | 5 min |
| 10 | Close | See below | 2 min |

Anchors left unchanged by design: **German Logistics Quote (Hans Geis)** and **Passport Verification**. Use them only if asked for a proof of numeric reasoning or ID handling; otherwise skip.

---

## Speaker lines

**Opening (Home).**
"LSEG describes resilience as 'at the heart of everything we do'. So I want to show you AI that is built the same way: it runs on IBM Power you already trust, the model is local, and nothing calls out to a public cloud."

**IT Ops Email — French (LCH SA clearing stream).**
"This is a clearing-stream incident written in French. Watch three things: the English summary, the extracted error code, and the priority. A broker quorum loss with 15 trade batches at risk of missing the 16:30 settlement window is Critical, and it should say so."
*Expected:* error code `BROKER_QUORUM_LOST_0x4A7B`, deadline 2 hours, financial impact about €47 million notional, True Priority = Critical.

**IT Ops Email — Italian (Borsa Italiana analyst).**
"Now the opposite. Very emotional email, but live customer feeds are unaffected, so the real priority is Medium. A model that reacts to capital letters would get this wrong."
*Expected:* topic `indici.ftsemib.eod`, True Priority = Medium, emotional state panicked/stressed, business impact excludes personal job fears.

**Subscription Summary.**
"This is the kind of internal note your team writes before a renewal. Platform, partner, current and expanded values, renewal date, contact. Structured in seconds, on your hardware."
*Expected:* Confluent Platform; current vendor relationship = direct with vendor; proposed partner = SCC; GBP 1.8m now, GBP 3.2m expanded; renewal 31 March 2027; contact Priya Raman, Head of Platform Engineering.

**Sales Intelligence (SCC call).**
"This is the call SCC would have with your Head of Platform Engineering. The model pulls out budget, timeline, pain points and the alternatives being considered, so procurement sees the comparison early."
*Expected:* budget about £3m a year, timeline March renewal, pain points = acquired-data onboarding and manual resilience evidence, competitors = open-source Apache Kafka and a cloud managed streaming service, CTA = schedule/architecture session.

**Multilingual Support (German).**
"A German-speaking asset manager is angry about delayed index data. Native-speaker QA is expensive; here the sentiment journey and resolution are produced locally."
*Expected:* initial Angry/Very Angry, final Satisfied/Positive, Resolved, compensation = one day's fee credited.

**Meeting Intelligence.**
"The session we are proposing, captured as decisions and owned actions with dates."
*Expected:* post-trade and settlement first, acquired-data onboarding second, AI-ready foundation after governance; five dated actions (inventory 20 Nov, evidence requirements 27 Nov, co-term plan 24 Nov, sizing to CTO end of month, connector security review 4 Dec); next meeting 8 December; open question on self-managed vs managed second cluster.

**PII (Fraud Complaint, Document Discovery).**
"Anything with names, card numbers or subscriber lists is exactly what should never go to a public API. It stays here."
*Expected:* all PII types found including card number; document scan flags 125,000 and 89,000 record counts and named individuals.

**Client drives.** "Paste any non-sensitive paragraph from your own world. The conversation changes when it is your text."

**Close.**
"Your data, your hardware, your model. Confluent is now part of IBM, SCC brings them together under one UK partner, and the next step is the 90-minute architecture and value session."

---

## Likely objections

| Persona | Objection | Response |
|---|---|---|
| CTO | "We already have Confluent. Why add Power?" | "You don't have to. Confluent expansion stands alone. This shows what a private AI layer *beside* it looks like when you're ready; scenario four in the proposal." |
| Head of Operational Resilience | "Is this production-grade?" | "No, it is a demo on a single reserved instance. The architecture (model, proxy, UI) is what promotes to a pilot; the delta is security review and credentials." |
| Platform Engineering | "Does this talk to our Kafka?" | "Not today. Integration would be a consumer/producer pattern; we'd scope it in the workshop. I won't claim more than I've shown." |
| Security / DPO | "Where does the data go?" | "Nowhere. The model is local on Power; the proxy and UI are on the same host. You can confirm by watching the network." |
| Procurement | "Why SCC rather than direct?" | "Same technology. SCC adds consolidated invoicing, UK 24/7 support, delivery and consumption governance. See the comparison table in the proposal." |
| Architect | "Accuracy of a small model?" | "Granite 4.0 Micro is small by design and runs at interactive speed on Power. For harder tasks you can swap in a larger Granite model. We validate on your data in a pilot." |

## "What next" close

1. 90-minute architecture and value session (as in the CTO proposal).
2. Pick one text workflow from LSEG's own non-sensitive samples to run in a Power pilot.
3. SCC to baseline the Confluent contract and propose a no-disruption transition at renewal.

## Reminders

- Do not quote any figure in the sample data as LSEG's own. Everything is invented.
- Do not present SCC credentials beyond what is in the CTO proposal (50 years with IBM, Platinum partner, UK Partner of the Year 2025/26, 15+ IBM specialists).
- LSEG facts used on the home page come from the proposal's cited public sources; Confluent contract and usage are unknown.
