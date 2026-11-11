// IT Ops Email Scenarios for Entity Extraction Demo
// LSEG tailoring: Italian (Borsa Italiana, market data) and French (LCH SA, post-trade) streaming incidents.
// All names, systems, codes and figures are fictional.

export const IT_OPS_SCENARIOS = {
  italian_emotional: {
    title: "Emotional Italian Market Data Feed Issue",
    description: "Borsa Italiana analyst reports a stalled event stream - demonstrates handling emotional language and priority assessment",
    language: "Italian",
    email: `Oggetto: URGENTE!!! Il flusso dati di mercato non si aggiorna - AIUTO!!!

Caro Team IT,

Sono DISPERATO!!! Il flusso degli indici FTSE MIB nel nostro report di analisi è fermo e non riesco a generare il riepilogo di fine giornata per il Direttore Dati e Analytics! La riunione è domani mattina alle 9:00 e io non ho NIENTE da presentare!

Ho provato tutto - ho riavviato il client tre volte, ho svuotato la cache locale, ho pregato... NIENTE FUNZIONA! Il sistema mi dà sempre lo stesso errore: "Consumer lag superiore alla soglia - timeout dopo 30 secondi sul topic indici.ftsemib.eod".

Questo è un DISASTRO! Il Direttore mi ha chiesto questo riepilogo la settimana scorsa e io gli ho promesso che sarebbe stato pronto. Se non riesco a consegnarlo, potrei perdere il mio lavoro! Ho una famiglia da mantenere, un mutuo da pagare... non posso permettermi di perdere questo lavoro!

Per favore, per favore, PER FAVORE aiutatemi SUBITO! Sono disposto a restare in ufficio tutta la notte se necessario. Questo è il problema più importante della mia vita professionale!

Il riepilogo che devo generare è solo un confronto dei valori di chiusura degli indici di ieri - niente di troppo complicato, ma il Direttore lo vuole assolutamente per la riunione di domani. I flussi di negoziazione e i dati in tempo reale per i clienti funzionano normalmente.

AIUTATEMI!!!

Cordiali saluti (ma molto stressati),
Marco Rossi
Analista Dati di Mercato
Tel: +39 02 1234 5678
Email: marco.rossi@example-borsa.it

P.S. - HO DAVVERO BISOGNO DI AIUTO URGENTE!!!`,
    entities: [
      {
        label: "English Summary",
        definition: "A concise summary of the email content in English (2-3 sentences covering the main issue and technical error)"
      },
      {
        label: "Sender Name",
        definition: "Who sent this email (full name)"
      },
      {
        label: "Sender Role",
        definition: "The job title or role of the sender"
      },
      {
        label: "Business Area",
        definition: "Which business department or function is affected (e.g., Data & Analytics, Markets, Risk Intelligence)"
      },
      {
        label: "Issue Type",
        definition: "The technical problem being reported"
      },
      {
        label: "Affected System",
        definition: "Which system, topic or application is having problems"
      },
      {
        label: "Error Message",
        definition: "Any specific error messages mentioned"
      },
      {
        label: "Time First Encountered",
        definition: "When did the problem first occur or was first noticed"
      },
      {
        label: "Deadline",
        definition: "When does this need to be resolved"
      },
      {
        label: "Business Impact",
        definition: "Organizational operational impact only: describe what business task is delayed (e.g. 'End-of-day index summary unavailable for a management meeting; live customer data and trading flows continue unaffected'). Ignore personal employment fears."
      },
      {
        label: "Emotional State",
        definition: "The emotional tone of the sender (e.g., Panicked, Stressed, Calm)"
      },
      {
        label: "True Priority",
        definition: "Must be exactly one of: Low, Medium, High, Critical. An unavailable internal end-of-day summary for a meeting, with live customer feeds unaffected, is strictly Medium. Critical is only for complete system-wide outages or safety hazards."
      },
      {
        label: "Suggested Solution Area",
        definition: "Based on the error and symptoms, what technical area should be investigated first (e.g., consumer group lag, broker health, network, application server, user permissions)"
      }
    ]
  },

  french_professional: {
    title: "Professional French Clearing Stream Critical Issue",
    description: "LCH SA Paris reports a post-trade event stream failure - demonstrates handling professional language and critical operational-resilience assessment",
    language: "French",
    email: `Objet: Incident Critique - Flux d'événements post-marché Paris - Risque de résilience opérationnelle

Bonjour l'équipe IT,

Je vous contacte concernant un incident technique critique affectant le flux d'événements post-marché de la chambre de compensation de Paris.

DÉTAILS TECHNIQUES:
- Système affecté: Cluster de streaming de compensation (CLR-Stream-Paris v3.2)
- Erreur: Perte du quorum du contrôleur et défaillance de la réplication des partitions
- Code d'erreur: BROKER_QUORUM_LOST_0x4A7B
- Heure de détection: 14:30 CET aujourd'hui

IMPACT OPÉRATIONNEL:
Le flux ne peut plus publier les confirmations de négociation vers le module de calcul des appels de marge. Environ 2 400 confirmations de négociation par minute s'accumulent en file d'attente. Si le flux n'est pas rétabli avant la clôture de la fenêtre de règlement de 16:30, les appels de marge intrajournaliers ne pourront pas être calculés sur des données à jour.

L'arriéré augmente d'environ 2 400 messages par minute depuis la détection.

RISQUES IDENTIFIÉS:
1. Risque de résilience: Position de risque des membres compensateurs non à jour pendant la séance
2. Risque opérationnel: Impossibilité de règlement de 15 lots d'opérations (valeur notionnelle: €47 millions)
3. Risque réglementaire: Non-conformité avec les exigences de résilience opérationnelle et de déclaration

ACTIONS DÉJÀ ENTREPRISES:
- Notification du responsable de la gestion des risques (M. Dubois)
- Activation du plan de continuité d'activité pour le post-marché
- Basculement manuel vers le site secondaire demandé
- Équipe d'astreinte en alerte

DEMANDE:
Intervention technique urgente requise dans les 2 heures pour:
1. Restaurer le quorum et la réplication du cluster
2. Vérifier l'intégrité et l'ordre des messages en file d'attente
3. Valider le basculement vers le site secondaire

Cette situation nécessite une résolution immédiate pour éviter un incident de résilience majeur et permettre la reprise normale du règlement.

Je reste disponible pour toute information complémentaire.

Cordialement,
Sophie Lefebvre, Ing.
Responsable Opérations Post-Marché - Paris
Tél: +33 1 45 67 89 00
Email: sophie.lefebvre@example-clearing.fr

Classification: URGENT - RÉSILIENCE`,
    entities: [
      {
        label: "English Summary",
        definition: "A concise summary of the email content in English (2-3 sentences covering the main issue, impact, and request)"
      },
      {
        label: "Sender Name",
        definition: "Who sent this email (full name)"
      },
      {
        label: "Sender Role",
        definition: "The job title or role of the sender"
      },
      {
        label: "Business Area",
        definition: "Which business department or function is affected (e.g., Post-trade, Clearing, Markets)"
      },
      {
        label: "Issue Type",
        definition: "The technical problem being reported"
      },
      {
        label: "Affected System",
        definition: "Which system or application is having problems"
      },
      {
        label: "Error Code",
        definition: "Any specific error codes mentioned"
      },
      {
        label: "Time First Encountered",
        definition: "When did the problem first occur or was first noticed"
      },
      {
        label: "Response Deadline",
        definition: "Required response time"
      },
      {
        label: "Business Impact",
        definition: "Organizational operational impact only: describe what facility or business workflow is affected. Ignore personal anxiety."
      },
      {
        label: "Safety Risk",
        definition: "Any operational-resilience, systemic-risk or regulatory risk mentioned (for example settlement failure, stale risk positions, reporting breach)"
      },
      {
        label: "Financial Impact",
        definition: "Monetary value of affected operations or potential losses"
      },
      {
        label: "True Priority",
        definition: "Must be exactly one of: Low, Medium, High, Critical. Guidance: Critical is strictly for imminent settlement failure, systemic operational-resilience risk, or complete service shutdown."
      },
      {
        label: "Suggested Solution Area",
        definition: "Based on the error and symptoms, what technical area should be investigated first (e.g., broker quorum, partition replication, network, failover site, database)"
      }
    ]
  }
};

export const getScenario = (scenarioKey) => {
  return IT_OPS_SCENARIOS[scenarioKey] || IT_OPS_SCENARIOS.italian_emotional;
};

export const getAllScenarios = () => {
  return Object.keys(IT_OPS_SCENARIOS).map(key => ({
    key,
    ...IT_OPS_SCENARIOS[key]
  }));
};

// Made with Bob
