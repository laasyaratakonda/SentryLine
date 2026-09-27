// In-memory store for the demo.
// Resets whenever the serverless function cold-starts or the app redeploys.
// Swap this for a real database (Postgres, Redis, etc.) to persist data.

function seedRequests() {
  const now = Date.now();
  return [
    {
      id: "req_1",
      connector: "Gmail",
      tool: "Read thread",
      target: "\"Q3 renewal — Meridian Corp\"",
      reason: "Checking for the latest reply before drafting a follow-up.",
      riskNote: "Thread contains a phone number and a billing address.",
      time: now - 1000 * 60 * 3,
      status: "pending",
    },
    {
      id: "req_2",
      connector: "Slack",
      tool: "Send message",
      target: "#customer-escalations",
      reason: "Notifying the channel that the Meridian ticket was resolved.",
      riskNote: null,
      time: now - 1000 * 60 * 9,
      status: "pending",
    },
    {
      id: "req_3",
      connector: "Google Sheets",
      tool: "Write range",
      target: "Pipeline 2026!B14:B14",
      reason: "Updating the deal stage to \"Closed won.\"",
      riskNote: "New value looks like a dollar figure.",
      time: now - 1000 * 60 * 22,
      status: "pending",
    },
    {
      id: "req_4",
      connector: "Jira",
      tool: "Create issue",
      target: "OPS project",
      reason: "Filing a bug found while reading the support thread.",
      riskNote: null,
      time: now - 1000 * 60 * 41,
      status: "approved",
    },
    {
      id: "req_5",
      connector: "Confluence",
      tool: "Read page",
      target: "\"Runbook: Payment outages\"",
      reason: "Looking up the on-call escalation path.",
      riskNote: null,
      time: now - 1000 * 60 * 58,
      status: "denied",
    },
  ];
}

function seedConnectors() {
  return [
    { id: "gmail", name: "Gmail", enabled: true },
    { id: "drive", name: "Google Drive & Sheets", enabled: true },
    { id: "calendar", name: "Google Calendar", enabled: true },
    { id: "slack", name: "Slack", enabled: true },
    { id: "jira", name: "Jira", enabled: true },
    { id: "confluence", name: "Confluence", enabled: false },
    { id: "salesforce", name: "Salesforce", enabled: false },
    { id: "telegram", name: "Telegram", enabled: false },
  ];
}

// Persist across hot-reloads in dev and across invocations within one
// warm serverless instance by hanging state off `global`.
const g = globalThis;
if (!g.__pfStore) {
  g.__pfStore = {
    requests: seedRequests(),
    connectors: seedConnectors(),
    nextId: 6,
  };
}

export const store = g.__pfStore;

export function decideRequest(id, decision) {
  const req = store.requests.find((r) => r.id === id);
  if (!req) return null;
  if (req.status !== "pending") return req;
  req.status = decision;
  req.decidedAt = Date.now();
  return req;
}

export function toggleConnector(id, enabled) {
  const c = store.connectors.find((c) => c.id === id);
  if (!c) return null;
  c.enabled = enabled;
  return c;
}
