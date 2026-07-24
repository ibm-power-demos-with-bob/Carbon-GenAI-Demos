// IT Ops Email Scenarios for Entity Extraction Demo
// Tailored for Premier Farnell / Avnet — electronics distribution context

export const IT_OPS_SCENARIOS = {
  italian_emotional: {
    title: "Emotional Italian Inventory System Failure",
    description: "Demonstrates handling emotional language and priority assessment",
    language: "Italian",
    email: `Oggetto: URGENTE!!! Il sistema di gestione magazzino non funziona - AIUTO!!!

Caro Team IT,

Sono DISPERATO!!! Il nostro sistema di gestione delle scorte è completamente bloccato e non riesco ad elaborare gli ordini in entrata! Abbiamo oltre 300 ordini clienti in coda che non possiamo evadere!

Ho provato tutto - ho riavviato il terminale tre volte, ho cancellato la cache, ho chiamato il mio responsabile... NIENTE FUNZIONA! Il sistema continua a darmi lo stesso errore: "Errore di connessione al database di magazzino - timeout dopo 30 secondi".

Questo è un DISASTRO! Abbiamo un cliente prioritario - un grande produttore di elettronica - che aspetta un lotto di componenti critici per la sua linea di produzione. Se non spediamo entro le 14:00 di oggi, perdiamo il contratto! Il nostro responsabile commerciale mi ha già chiamato due volte stamattina!

Per favore, per favore, PER FAVORE aiutatemi SUBITO! Sono disposto a restare qui tutta la notte se necessario. Questo è il problema più urgente che abbiamo avuto in mesi!

Gli ordini bloccati includono componenti SMD, connettori industriali e moduli di alimentazione - materiale che i clienti hanno già pagato e si aspettano oggi!

AIUTATEMI!!!

Cordiali saluti (ma molto stressati),
Marco Ferretti
Responsabile Magazzino - Milano
Tel: +39 02 1234 5678
Email: marco.ferretti@farnell.it

P.S. - HO DAVVERO BISOGNO DI AIUTO URGENTE!!!`,
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
        definition: "Which business department or function is affected (e.g., Warehouse, Logistics, Sales)"
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
        label: "Error Message",
        definition: "Any specific error messages mentioned"
      },
      {
        label: "Deadline",
        definition: "When does this need to be resolved"
      },
      {
        label: "Business Impact",
        definition: "The actual impact on business operations (what can't be done)"
      },
      {
        label: "Emotional State",
        definition: "The emotional tone of the sender (calm/stressed/panicked)"
      },
      {
        label: "True Priority",
        definition: "Objective assessment of priority: Low (no immediate business impact), Medium (business inconvenience), High (business disruption), Critical (safety/major financial risk)"
      },
      {
        label: "Suggested Solution Area",
        definition: "Based on the error and symptoms, what technical area should be investigated first (e.g., database connectivity, network, application server, user permissions)"
      }
    ]
  },

  french_professional: {
    title: "Professional French Temperature-Controlled Storage Alert",
    description: "Demonstrates handling professional language and critical safety assessment",
    language: "French",
    email: `Objet: Incident Critique - Système de Contrôle Température - Entrepôt Composants Sensibles - Risque Sécurité

Bonjour l'équipe IT,

Je vous contacte concernant un incident technique critique affectant le système de gestion climatique de notre zone de stockage haute densité.

DÉTAILS TECHNIQUES:
- Système affecté: Module de contrôle climatique et inventaire (WMS-Climate-Control v3.2)
- Erreur: Défaillance du système de surveillance de température
- Code d'erreur: TEMP_SENSOR_FAIL_0x4A7B
- Heure de détection: 14:30 CET aujourd'hui

IMPACT OPÉRATIONNEL:
Le système ne peut plus surveiller ni réguler la température dans la zone de stockage C, qui contient actuellement 2,400 unités de composants électroniques sous pression (condensateurs électrolytiques haute tension et batteries lithium-ion). Sans contrôle de température, ces composants présentent un risque de défaillance thermique si la température dépasse 40°C.

La température ambiante actuelle est de 28°C et augmente de 2°C par heure en raison de l'ensoleillement direct sur cette section du bâtiment.

RISQUES IDENTIFIÉS:
1. Risque de sécurité: Défaillance thermique potentielle des composants sous pression
2. Risque opérationnel: Impossibilité d'expédier 15 commandes clients (valeur: €47,000)
3. Risque réglementaire: Non-conformité avec les normes de stockage de composants dangereux (RoHS/WEEE)

ACTIONS DÉJÀ ENTREPRISES:
- Notification du responsable sécurité (M. Dubois)
- Activation du protocole d'urgence pour composants sensibles
- Ventilation manuelle de la zone activée
- Équipe de sécurité en alerte

DEMANDE:
Intervention technique urgente requise dans les 2 heures pour:
1. Restaurer le système de surveillance de température
2. Vérifier l'intégrité des données d'inventaire
3. Valider le système de contrôle climatique

Cette situation nécessite une résolution immédiate pour éviter un incident de sécurité et permettre la reprise des expéditions.

Je reste disponible pour toute information complémentaire.

Cordialement,
Sophie Lefebvre, Ing.
Responsable Logistique - Entrepôt Lyon
Tél: +33 1 45 67 89 00
Email: sophie.lefebvre@farnell.fr

Classification: URGENT - SÉCURITÉ`,
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
        definition: "Which business department or function is affected (e.g., Warehouse, Logistics, Sales)"
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
        label: "Response Deadline",
        definition: "Required response time"
      },
      {
        label: "Business Impact",
        definition: "The actual impact on business operations (what can't be done)"
      },
      {
        label: "Safety Risk",
        definition: "Any safety or health risks mentioned (thermal failure, fire, component damage, etc.)"
      },
      {
        label: "Financial Impact",
        definition: "Monetary value of affected operations or potential losses"
      },
      {
        label: "True Priority",
        definition: "Objective assessment of priority: Low (no immediate business impact), Medium (business inconvenience), High (business disruption), Critical (safety/major financial risk)"
      },
      {
        label: "Suggested Solution Area",
        definition: "Based on the error and symptoms, what technical area should be investigated first (e.g., sensor hardware, climate control system, database, network)"
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
