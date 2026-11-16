// Minimal dependency-free PDF writer: one A4 page, Helvetica text only (Latin-1).
// Good enough for a readable invoice in the viewer; real documents come from Digitize later.

const esc = (s) => String(s).replace(/[^\x20-\x7e\xa0-\xff]/g, "?").replace(/([\\()])/g, "\\$1");

function renderInvoicePdf(doc) {
  const f = doc.fields;
  const out = [];
  let y = 800;
  const text = (x, size, s, bold) => out.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${esc(s)}) Tj ET`);
  const line = (gap = 14) => (y -= gap);

  text(50, 20, "TAX INVOICE", true); line(30);
  text(50, 11, `Invoice no: ${f.invoice.number}`); text(330, 11, `Date: ${f.invoice.date}`); line();
  text(50, 11, `Payment terms: ${f.invoice.paymentTerms}`); text(330, 11, `Due: ${f.invoice.dueDate}`); line(30);

  text(50, 11, "Vendor", true); text(330, 11, "Ship to / Bill to", true); line();
  const v = f.vendor, c = f.billTo;
  text(50, 10, v.name); text(330, 10, c.name); line(12);
  text(50, 10, v.address); text(330, 10, c.address); line(12);
  text(50, 10, `VAT ID: ${v.vatId}`); text(330, 10, `VAT ID: ${c.vatId}`); line(12);
  text(50, 10, v.country); text(330, 10, c.country); line(34);

  text(50, 10, "Description", true); text(300, 10, "Qty", true); text(350, 10, "Unit", true); text(410, 10, "VAT %", true); text(470, 10, `Amount ${f.invoice.currency}`, true); line(16);
  for (const l of f.lineItems) {
    text(50, 10, l.description); text(300, 10, l.quantity); text(350, 10, l.unitPrice); text(410, 10, l.vatRate); text(470, 10, l.amount); line(14);
  }
  line(16);
  text(380, 10, `Net: ${f.totals.net}`); line(13);
  text(380, 10, `VAT: ${f.totals.vat}`); line(13);
  text(380, 12, `Total ${f.invoice.currency}: ${f.totals.gross}`, true);

  const stream = out.join("\n");
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(Buffer.byteLength(body, "latin1"));
    body += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body, "latin1");
  body += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => (body += `${String(o).padStart(10, "0")} 00000 n \n`));
  body += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(body, "latin1");
}

module.exports = { renderInvoicePdf };
