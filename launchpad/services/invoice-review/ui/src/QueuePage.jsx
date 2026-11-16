import React, { useEffect, useMemo, useState } from "react";
import { Button, InlineLoading, Search, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";

const STEPS = ["Upload", "Extract", "Review", "Export"];
const STATUS_CLASS = { Pending: "st-pending", Extracting: "st-extracting", "Awaiting review": "st-review", Exported: "st-done" };

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { timeZone: "Europe/Berlin" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });

function StageBar({ doc }) {
  const cls = STATUS_CLASS[doc.status];
  return (
    <div className="stage">
      <div className="stage-label">{doc.stage}</div>
      <div className="stage-bar" role="img" aria-label={`Step ${doc.stageStep} of ${STEPS.length}: ${doc.stage}`}>
        {STEPS.map((s, i) => (
          <span key={s} className={i < doc.stageStep ? `seg on ${cls}` : "seg"} />
        ))}
      </div>
      {doc.source && <div className="stage-source">{doc.source}</div>}
    </div>
  );
}

function Status({ status }) {
  if (status === "Extracting") return <InlineLoading description="Extracting" status="active" />;
  return (
    <span className="status">
      <span className={`dot ${STATUS_CLASS[status]}`} />
      {status === "Pending" ? "\u2013 Pending" : status}
    </span>
  );
}

export default function QueuePage() {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("api/documents")
      .then((r) => r.json())
      .then(setDocs)
      .catch((e) => setError(String(e)));
  }, []);

  const shown = useMemo(() => (docs || []).filter((d) => d.name.toLowerCase().includes(q.toLowerCase())), [docs, q]);

  return (
    <>
      <h1 className="page-title">Extraction queue</h1>
      <p className="page-intro">
        Review information extracted from documents. Verify the extracted fields against the source document, then approve to
        export the record to your environment.
      </p>
      <div className="panel">
        <Search size="lg" labelText="Search extraction queue" placeholder="Search extraction queue" value={q} onChange={(e) => setQ(e.target.value)} />
        {error && <p className="error">Could not load the queue: {error}</p>}
        {!docs && !error && <InlineLoading description="Loading queue" />}
        {docs && (
          <Table aria-label="Extraction queue">
            <TableHead>
              <TableRow>
                <TableHeader>Document name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date received</TableHeader>
                <TableHeader>Process stage</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {shown.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell><Status status={d.status} /></TableCell>
                  <TableCell>
                    <div>{fmtDate(d.received)}</div>
                    <div className="muted">{fmtTime(d.received)}</div>
                  </TableCell>
                  <TableCell><StageBar doc={d} /></TableCell>
                  <TableCell className="action">
                    {(d.status === "Awaiting review" || d.status === "Exported") && (
                      <Button kind="tertiary" size="sm" renderIcon={ArrowRight} href={`#/review/${d.id}`}>
                        {d.status === "Exported" ? "View" : "Review"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

