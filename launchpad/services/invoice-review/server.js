// invoice-review service: serves the Carbon UI (./dist) and a small API on one port (8080), so the
// Launchpad route annotation can expose both ":ui" and ":api" from one container.
// Extraction here is MOCK data (sample-data.js). Export is SIMULATED: nothing leaves the pod.
// Node 22 built-ins only.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { documents } = require("./sample-data");
const { renderInvoicePdf } = require("./pdf");

const PORT = parseInt(process.env.PORT || "8080", 10);
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || "";
const LLM_MODEL = process.env.LLM_MODEL || "";
const DIST = path.resolve(process.env.DIST_DIR || path.join(__dirname, "dist"));

const CONNECTIONS = [
  { id: "ibmi-db2", name: "IBM i Db2 - PROD-DB2-01", type: "IBM i Db2" },
  { id: "aix-oracle", name: "AIX Oracle - PROD-ORA-01", type: "AIX Oracle" },
];

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".ico": "image/x-icon" };

const json = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let b = "";
    req.on("data", (c) => (b += c));
    req.on("end", () => {
      try { resolve(JSON.parse(b || "{}")); } catch { resolve({}); }
    });
  });

const summary = ({ fields, ...rest }) => rest;

async function hello() {
  const t0 = Date.now();
  const r = await fetch(`${LLM_ENDPOINT}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: LLM_MODEL, max_tokens: 30, messages: [{ role: "user", content: "Say hello from IBM Power in one short sentence." }] }),
  });
  const j = await r.json();
  return { status: r.status, seconds: (Date.now() - t0) / 1000, reply: j.choices?.[0]?.message?.content ?? j };
}

function serveStatic(res, urlPath) {
  let file = path.normalize(path.join(DIST, urlPath === "/" ? "index.html" : urlPath));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  if (!fs.existsSync(file)) {
    res.writeHead(503, { "Content-Type": "text/plain" });
    return res.end("UI not built (missing dist/). Run: cd ui && npm ci && npm run build");
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer(async (req, res) => {
    const url = req.url.split("?")[0];
    const m = url.match(/^\/api\/documents\/([^/]+)(\/file|\/export)?$/);

    if (url === "/health") { res.writeHead(200); return res.end("ok"); }
    if (url === "/api/info") return json(res, 200, { llmEndpoint: LLM_ENDPOINT, llmModel: LLM_MODEL, extraction: "mock", export: "simulated" });
    if (url === "/api/hello") {
      try { return json(res, 200, await hello()); } catch (e) { return json(res, 502, { error: String(e) }); }
    }
    if (url === "/api/connections") return json(res, 200, CONNECTIONS);
    if (url === "/api/documents" && req.method === "GET") return json(res, 200, documents.map(summary));

    if (m) {
      const doc = documents.find((d) => d.id === m[1]);
      if (!doc) return json(res, 404, { error: "not found" });
      if (m[2] === "/file") {
        res.writeHead(200, { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${doc.name}"` });
        return res.end(renderInvoicePdf(doc));
      }
      if (m[2] === "/export" && req.method === "POST") {
        const body = await readBody(req);
        const target = CONNECTIONS.find((c) => c.id === body.connectionId);
        if (!target) return json(res, 400, { error: "unknown connection" });
        doc.status = "Exported"; doc.stage = "Export"; doc.stageStep = 4;
        return json(res, 200, { simulated: true, target: target.name, message: "Simulated export: no data was sent." });
      }
      if (!m[2] && req.method === "GET") return json(res, 200, doc);
    }
    return serveStatic(res, url);
  })
  .listen(PORT, "0.0.0.0", () => console.log(`invoice-review listening on ${PORT}`));
