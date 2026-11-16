import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem, CodeSnippet, Dropdown, InlineNotification, Modal } from "@carbon/react";

// Simulated export: the dialog lists saved connections and previews exactly what would be sent;
// the server only records the status change. Nothing leaves the pod.
export default function ExportModal({ open, docId, payload, onClose, onDone }) {
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("api/connections").then((r) => r.json()).then(setConnections).catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setError(null);
    }
  }, [open]);

  const submit = async () => {
    setBusy(true);
    try {
      const r = await fetch(`api/documents/${docId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId: selected.id, payload }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      onDone(await r.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      modalHeading="Export extracted data"
      primaryButtonText="Export"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={!selected || busy}
      onRequestClose={onClose}
      onRequestSubmit={submit}
    >
      <p className="modal-intro">Select a saved database connection to export the extracted record.</p>
      <Dropdown
        id="export-destination"
        titleText="Destination"
        label="Select a connection"
        items={connections}
        itemToString={(c) => (c ? c.name : "")}
        selectedItem={selected}
        onChange={({ selectedItem }) => setSelected(selectedItem)}
      />
      {selected && (
        <>
          <p className="modal-type">
            <strong>Type:</strong> {selected.type}
          </p>
          <Accordion>
            <AccordionItem title="Inspect extracted data">
              <CodeSnippet type="multi" feedback="Copied" wrapText={false} maxCollapsedNumberOfRows={14} maxExpandedNumberOfRows={30}>
                {JSON.stringify(payload, null, 2)}
              </CodeSnippet>
            </AccordionItem>
          </Accordion>
          <InlineNotification
            hideCloseButton
            lowContrast
            kind="info"
            title="Demo mode"
            subtitle="The export is simulated. The record is not sent to any database."
          />
        </>
      )}
      {error && <InlineNotification hideCloseButton lowContrast kind="error" title="Export failed" subtitle={error} />}
    </Modal>
  );
}
