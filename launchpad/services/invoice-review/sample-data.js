// Fictional sample invoices for the demo queue. All companies are invented.
// "fields" is what the real Extract service would return; here it is computed so the demo
// works with no LLM. Replace buildFields() with a Digitize -> Extract call later (same shape).

const PARTIES = [
  { name: "Nordlicht Lebensmittel GmbH", address: "Speicherstrasse 14, 20457 Hamburg", vatId: "DE312456789", country: "Germany" },
  { name: "Brasserie Lumiere SARL", address: "22 Rue de la Republique, 69002 Lyon", vatId: "FR40303265045", country: "France" },
  { name: "Costa Verde Importaciones SL", address: "Calle del Puerto 8, 46002 Valencia", vatId: "ESB46123456", country: "Spain" },
  { name: "Hartwell & Finch Supplies Ltd", address: "Unit 4, Brindley Road, Manchester M16 9HQ", vatId: "GB123456789", country: "United Kingdom" },
  { name: "Alpenhof Gastronomie AG", address: "Bahnhofstrasse 31, 8001 Zurich", vatId: "CHE-123.456.789", country: "Switzerland" },
];

// [description, unit price, VAT %]
const PRODUCTS = [
  ["Ginger garlic paste 1 kg", 105.0, 7],
  ["Dehydrated onion 1 kg", 153.0, 7],
  ["Wild honey 1 kg", 208.0, 7],
  ["Olive oil extra virgin 5 l", 64.5, 7],
  ["Catering napkins (box of 500)", 18.9, 19],
  ["Cold-chain delivery surcharge", 45.0, 19],
];

// vendor, customer, [[product, qty]...]
const SPECS = [
  { id: "d1", name: "INV-2026-1003.pdf", status: "Awaiting review", received: "2026-10-14T13:41:00+02:00", v: 0, c: 1, items: [[0, 144], [1, 300], [2, 24]], no: "INV-2026-1003", date: "2026-07-25", due: "2026-08-09", currency: "EUR", terms: "15 days" },
  { id: "d2", name: "invoice_nordlicht_T5087.pdf", status: "Awaiting review", received: "2026-10-07T09:41:00+02:00", v: 0, c: 2, items: [[3, 40], [4, 12]], no: "T5087", date: "2026-09-30", due: "2026-10-30", currency: "EUR", terms: "30 days" },
  { id: "d3", name: "INV-2026-0828-supplies.pdf", status: "Awaiting review", received: "2026-09-22T17:50:00+02:00", v: 3, c: 4, items: [[4, 60], [5, 2]], no: "0828", date: "2026-09-18", due: "2026-10-18", currency: "GBP", terms: "30 days" },
  { id: "d4", name: "vendor_inv_0094.pdf", status: "Awaiting review", received: "2026-09-05T03:33:00+02:00", v: 2, c: 1, items: [[3, 120], [2, 10]], no: "0094", date: "2026-09-01", due: "2026-09-15", currency: "EUR", terms: "14 days" },
  { id: "d5", name: "rechnung_scan_0026.pdf", status: "Awaiting review", received: "2026-08-19T01:11:00+02:00", v: 4, c: 0, items: [[1, 80], [5, 1]], no: "R-0026", date: "2026-08-15", due: "2026-09-14", currency: "CHF", terms: "30 days" },
  { id: "d6", name: "scan_invoice_aug28.pdf", status: "Extracting", received: "2026-10-15T08:11:00+02:00", v: 1, c: 3, items: [[0, 10]], no: "A-2808", date: "2026-08-28", due: "2026-09-27", currency: "EUR", terms: "30 days" },
  { id: "d7", name: "Facture_Delacroix_Aug26.pdf", status: "Pending", received: "2026-10-15T10:21:00+02:00", source: "From IBM i QSYS - Finance IFS", v: 1, c: 4, items: [[2, 6]], no: "F-26-0814", date: "2026-08-26", due: "2026-09-25", currency: "EUR", terms: "30 days" },
];

const STAGE = { Pending: ["Upload", 1], Extracting: ["Extract", 2], "Awaiting review": ["Review", 3], Exported: ["Export", 4] };

const money = (n) => n.toFixed(2);

function buildFields(s) {
  const lineItems = s.items.map(([p, qty]) => {
    const [description, unit, vat] = PRODUCTS[p];
    return { description, quantity: String(qty), unitPrice: money(unit), vatRate: String(vat), amount: money(unit * qty), _vat: (unit * qty * vat) / 100 };
  });
  const net = lineItems.reduce((a, l) => a + Number(l.amount), 0);
  const vat = lineItems.reduce((a, l) => a + l._vat, 0);
  lineItems.forEach((l) => delete l._vat);
  return {
    vendor: { ...PARTIES[s.v] },
    shipTo: { ...PARTIES[s.c] },
    billTo: { ...PARTIES[s.c] },
    invoice: { number: s.no, date: s.date, dueDate: s.due, currency: s.currency, paymentTerms: s.terms },
    lineItems,
    totals: { net: money(net), vat: money(vat), gross: money(net + vat) },
  };
}

const documents = SPECS.map((s) => {
  const [stage, step] = STAGE[s.status];
  return { id: s.id, name: s.name, status: s.status, stage, stageStep: step, received: s.received, source: s.source || null, fields: buildFields(s) };
});

module.exports = { documents, STAGE };
