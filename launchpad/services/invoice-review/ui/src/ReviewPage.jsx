import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, Breadcrumb, BreadcrumbItem, Button, InlineLoading, InlineNotification, Tag, TextInput, Tile } from "@carbon/react";
import ExportModal from "./ExportModal.jsx";

const PARTY_FIELDS = [
  ["name", "Name"],
  ["address", "Address"],
  ["vatId", "VAT ID"],
  ["country", "Country"],
];
const INVOICE_FIELDS = [
  ["number", "Invoice number"],
  ["date", "Invoice date"],
  ["dueDate", "Due date"],
  ["currency", "Currency"],
  ["paymentTerms", "Payment terms"],
];
const ITEM_COLS = [
  ["description", "Description"],
  ["quantity", "Qty"],
  ["unitPrice", "Unit price"],
  ["vatRate", "VAT %"],
  ["amount", "Amount"],
];
const TOTAL_FIELDS = [
  ["net", "Net"],
  ["vat", "VAT"],
  ["gross", "Gross"],
];

export default function ReviewPage({ id }) {
  const [doc, setDoc] = useState(null);
  const [fields, setFields] = useState(null);
  const [error, setError] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    setDoc(null);
    fetch(`api/documents/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => {
        setDoc(d);
        setFields(d.fields);
      })
      .catch((e) => setError(String(e)));
  }, [id]);

  const setIn = (section, key, value) => setFields((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  const setItem = (i, key, value) =>
    setFields((f) => ({ ...f, lineItems: f.lineItems.map((l, n) => (n === i ? { ...l, [key]: value } : l)) }));

  if (error) return <p className="error">Could not load the document: {error}</p>;
  if (!doc) return <InlineLoading description="Loading document" />;

  const payload = {
    document: { name: doc.name, extractedAt: new Date().toISOString() },
    vendor: fields.vendor,
    consignee: fields.shipTo,
    buyer: fields.billTo,
    invoice: fields.invoice,
    lineItems: fields.lineItems,
    totals: fields.totals,
  };

  const party = (title, key) => (
    <AccordionItem title={title} open>
      <div className="form-grid">
        {PARTY_FIELDS.map(([k, label]) => (
          <div key={k} className={k === "name" || k === "address" ? "span2" : undefined}>
            <TextInput id={`${key}-${k}`} labelText={label} value={fields[key][k]} onChange={(e) => setIn(key, k, e.target.value)} />
          </div>
        ))}
      </div>
    </AccordionItem>
  );

  return (
    <>
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem href="#/">Extraction queue</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Review document</BreadcrumbItem>
      </Breadcrumb>
      <h1 className="page-title">Review document</h1>
      {done && (
        <InlineNotification
          kind="success"
          lowContrast
          title="Export complete (simulated)"
          subtitle={`${done.target}: ${done.message}`}
          onCloseButtonClick={() => setDone(null)}
        />
      )}
      <div className="review">
        <Tile className="doc-pane">
          <div className="doc-head">
            <strong>{doc.name.replace(/\.pdf$/i, "")}</strong> <Tag size="sm" type="gray">PDF</Tag>
          </div>
          <div className="muted">
            Received {new Date(doc.received).toLocaleDateString("en-GB", { timeZone: "Europe/Berlin" })}{" "}
            {new Date(doc.received).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })}
          </div>
          <iframe className="pdf" title={doc.name} src={`api/documents/${doc.id}/file#navpanes=0&view=FitH`} />
        </Tile>
        <div className="fields-pane">
          <Accordion isFlush>
            {party("Vendor", "vendor")}
            {party("Consignee (Ship to)", "shipTo")}
            {party("Buyer (Bill to)", "billTo")}
            <AccordionItem title="Invoice" open>
              <div className="form-grid">
                {INVOICE_FIELDS.map(([k, label]) => (
                  <TextInput key={k} id={`inv-${k}`} labelText={label} value={fields.invoice[k]} onChange={(e) => setIn("invoice", k, e.target.value)} />
                ))}
              </div>
            </AccordionItem>
            <AccordionItem title="Line items" open>
              <table className="items">
                <thead>
                  <tr>{ITEM_COLS.map(([, label]) => <th key={label}>{label}</th>)}</tr>
                </thead>
                <tbody>
                  {fields.lineItems.map((l, i) => (
                    <tr key={i}>
                      {ITEM_COLS.map(([k, label]) => (
                        <td key={k}>
                          <TextInput id={`item-${i}-${k}`} size="sm" hideLabel labelText={`${label} ${i + 1}`} value={l[k]} onChange={(e) => setItem(i, k, e.target.value)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionItem>
            <AccordionItem title="Totals" open>
              <div className="form-grid">
                {TOTAL_FIELDS.map(([k, label]) => (
                  <TextInput key={k} id={`tot-${k}`} labelText={label} value={fields.totals[k]} onChange={(e) => setIn("totals", k, e.target.value)} />
                ))}
              </div>
            </AccordionItem>
          </Accordion>
          <div className="actions">
            <Button kind="secondary" href="#/">Back to queue</Button>
            <Button onClick={() => setExportOpen(true)}>Export...</Button>
          </div>
        </div>
      </div>
      <ExportModal
        open={exportOpen}
        docId={doc.id}
        payload={payload}
        onClose={() => setExportOpen(false)}
        onDone={(r) => {
          setExportOpen(false);
          setDone(r);
        }}
      />
    </>
  );
}


