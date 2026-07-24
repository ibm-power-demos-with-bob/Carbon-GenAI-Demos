# IBM Power GenAI Demo — Narration Script
## Premier Farnell Engagement · For Alex

**Audience:** Head of Infrastructure · Head of Development · IBM i team  
**Demo URL:** `http://p1265-pvm1.p1265.cecc.ihost.com:3000` *(IBM VPN required)*  
**Time budget:** ~20 minutes for the full demo, or pick 3–4 scenarios for a tighter slot

---

## Before you start — the one sentence that frames everything

> *"Everything you're about to see is IBM Granite AI running entirely on an IBM Power server. No cloud. No API keys. No data leaving the machine. That's the point."*

Say this once, up front. It lands differently for each person in the room:
- **IBM i team** — validates their platform choice
- **Head of Infrastructure** — answers the "where does our data go?" question before they ask it
- **Head of Development** — opens the door to the AI on Power conversation

---

## Opening — the home page (~1 min)

When you open the demo, show the home page briefly.

> *"What we have here is a web application — built with IBM's own design system — running on an IBM Power server in an IBM data centre. The AI model is IBM Granite 4.0. Everything runs on the Power hardware itself."*

> *"We've loaded it with scenarios from Farnell's world specifically — so rather than showing you generic demos, we wanted it to feel a bit more like your environment."*

Then navigate to **Entity Extraction**.

---

## 1. Entity Extraction — Component Catalogue Entry 📦
**Tab:** Entity Extraction → Book Review tab *(now shows component data)*  
**Best for:** Head of Development, IBM i team  
**Time:** ~3 minutes

Click the tab and show the pre-loaded text — a product description for a Texas Instruments ADC component.

> *"Here's a scenario that's directly relevant to Farnell. You have millions of product descriptions coming in from suppliers — unstructured text, inconsistent formats, different languages. The AI reads it and extracts the structured fields you actually need: part number, manufacturer, price, stock level, lead time."*

Submit it. While it processes:

> *"This is running on the Power server — IBM Granite 4.0 inferencing locally. No call going out to OpenAI, no data going to a cloud API. The model lives on the machine."*

When results appear:

> *"That's the kind of thing that today takes manual effort, or fragile ETL scripts that break when a supplier changes their format. With AI on Power, it becomes a service you can wrap around your existing IBM i data flows."*

**If the Head of Development engages:** *"The API is OpenAI-compatible — so any application that can call ChatGPT can call this instead, pointed at your own infrastructure."*

---

## 2. Multilingual IT Ops 🌍
**Tab:** Entity Extraction → IT Ops Email  
**Best for:** Head of Infrastructure, IBM i team  
**Time:** ~3 minutes

> *"Farnell operates in over 140 countries. Your support queues, your warehouse operations, your supplier communications — they come in from teams in Italy, France, Germany, Japan. This demo shows what happens when you put AI in front of that."*

Show the Italian scenario first — a panicked warehouse manager in Milan whose inventory system has gone down, with 300 orders blocked.

> *"This email comes in, in Italian. The support team doesn't speak Italian. Normally this sits in a queue until someone triages it. Watch what happens."*

Submit it. Show the results:

> *"English summary. Sender, role, affected system, error message, deadline, business impact — and crucially, a True Priority assessment. The model has read the emotional language and correctly assessed this as High, not Critical, because the data supports that."*

Toggle to the French scenario — the professional warehouse engineer in Lyon with the temperature-controlled component storage failure.

> *"Now a completely different tone — professional, structured, a real safety issue with lithium-ion components at risk. Same extraction, but watch the True Priority field."*

> *"Critical. Financial impact: €47,000. Safety risk identified. That's the model understanding context, not just pulling text."*

**The point to land:** *"Your IBM i system is already processing orders from 140 countries. This is what AI looks like sitting alongside that — not replacing it, augmenting it."*

---

## 3. German Logistics Quote — Hans Geis 🚚
**Tab:** Entity Extraction → Quote Email  
**Best for:** All three personas — this is the icebreaker  
**Time:** ~2 minutes

> *"This one I want to show you because it's a real IBM customer. Hans Geis — one of Germany's largest logistics companies — actually uses IBM Power for exactly this kind of scenario."*

Show the Hans Geis truck image and the German logistics email.

> *"Supplier sends a quote in German. The AI extracts every field — carrier, route, weight, dimensions — and then calculates the pallet count. Not just extraction — reasoning over the data."*

Submit and show results.

> *"The reason I show this is to make the point that this isn't theoretical. Companies in your sector, running IBM Power, are already doing this. Farnell could be next."*

---

## 4. PII Extraction — Fraud Complaint 🔒
**Tab:** PII Extraction → Fraud Complaint  
**Best for:** Head of Infrastructure, IBM i team — hits the cyber/compliance theme  
**Time:** ~3 minutes

> *"This one connects directly to something Avnet flagged as a board-level concern in their annual report — cybersecurity, data protection, GDPR compliance."*

> *"Scenario: a customer sends a complaint email. It contains their name, address, card number, phone number — eight types of PII. It needs to go to an L1 support agent who doesn't need to see any of that to resolve the technical issue. And it needs to be stored long-term without retaining the personal data."*

Submit and show the extraction and redacted output.

> *"The AI identifies all eight PII types and generates a redacted version of the original text — automatically. No human reviewer. No PII reaching the L1 agent. GDPR-compliant storage from the start."*

> *"And where does this run? On your Power infrastructure. The personal data never left your environment."*

**The line for the Head of Infrastructure:** *"This is the kind of capability that your CISO is going to ask about when they review the NIST framework alignment. It runs on the platform you already own."*

---

## 5. Document Discovery 📄
**Tab:** PII Extraction → Document Discovery  
**Best for:** Head of Infrastructure, compliance angle  
**Time:** ~2 minutes

Show the pre-loaded memo — a Farnell order management platform migration document, flagging 2.4 million customer records across 140 countries for GDPR review.

> *"Legacy data migration — something Farnell will recognise. You have years of customer order data, contact records, marketing data. Before you can migrate it, you need to know what personal data it contains and where."*

Submit it.

> *"Risk classification: the AI reads the document and flags it HIGH. It's identified the names, the email addresses, the phone numbers, the record counts — and told you this needs Data Protection Officer review before it moves."*

> *"That's a document governance workflow that traditionally takes teams of analysts weeks to run across a data estate. On Power, it becomes an automated service."*

---

## 6. RFP Assistant 📋
**Tab:** RFP Assistant  
**Best for:** Head of Development — shows the business productivity angle  
**Time:** ~2 minutes

> *"Last one — slightly different angle. This is for the business teams, not just IT."*

Show the pre-loaded RFP scenario — it's the Farnell e-commerce platform modernisation opportunity, with IBM in the supplier role.

> *"A bid team receives an RFP. Normally it takes days to produce the first draft response. The AI reads the requirements, scores the fit, recommends bid or no-bid, identifies the win themes, drafts the executive summary."*

Submit and show the output.

> *"The point here isn't the specific RFP — it's that this is the same Granite model, on the same Power server, now helping a completely different business function. Procurement, legal, sales, marketing — they can all use this."*

---

## Closing — what to leave them with (~1 min)

> *"What I want you to take away from this is not 'IBM has a nice demo.' It's that IBM Power is already the right foundation for AI — today, not in three years."*

> *"Your IBM i estate, your Orbit system, your order management platform — that's your most valuable operational data. The question isn't whether to add AI. It's whether you want the AI to run where the data already lives, or whether you want to move the data to the cloud to run AI there."*

> *"IBM Power gives you the first option. And that's increasingly the conversation that CISOs and CFOs are gravitating toward."*

---

## Tips for the room

**If the IBM i team wants to go deeper on the platform:**
Click "What We're Using" on any demo tab — it shows the full technical stack (IBM Granite, llama.cpp, the architecture). Good for a technical sidebar without derailing the main flow.

**If the Head of Infrastructure asks about security:**
> *"IBM i has one of the strongest security track records of any enterprise platform. The integrated security model, the reduced attack surface compared to a fragmented x86 estate, the encryption and audit capabilities — that's before you even add the AI layer."*

**If the Head of Development asks about integration:**
> *"The API is OpenAI-compatible. Any application that calls an LLM today can be pointed at this instead. Your developers don't need to learn a new interface."*

**If anyone asks about the model:**
> *"IBM Granite 4.0 Micro — IBM's own open-source model, trained on business and code data, built for enterprise use. It's not the biggest model in the world, but it's built to be trustworthy and deployable on your own hardware."*

**If anyone asks about cost:**
> *"No per-token charges. No API fees. No data egress costs. The model runs on hardware you already own or can license. The economics are fundamentally different from cloud AI."*

---

## Demo environment details (for Alex — technical reference)

- **URL:** `http://p1265-pvm1.p1265.cecc.ihost.com:3000`
- **IBM VPN required** — the server is only reachable on the IBM intranet
- **Server:** IBM Power10, RHEL 9.4, ppc64le, 123GB RAM
- **Branch deployed:** `farnell-demo` — all scenarios tailored for Premier Farnell
- **TechZone collection:** [Generative AI demos on IBM Power](https://techzone.ibm.com/collection/generative-ai-demos-on-ibm-power)
- **GitHub repo:** [ibm-power-demos-with-bob/Carbon-GenAI-Demos](https://github.com/ibm-power-demos-with-bob/Carbon-GenAI-Demos/tree/farnell-demo)
- **SSH access:** available via TechZone reservation (shared separately)

---

*Prepared by Bob (Pre-Sales Demo Builder) · EMEA AI on IBM Power Squad*
