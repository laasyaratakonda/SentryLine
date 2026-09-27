import { store } from "../../lib/store";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const decided = store.requests
    .filter((r) => r.status !== "pending")
    .sort((a, b) => (b.decidedAt || b.time) - (a.decidedAt || a.time));
  res.status(200).json({ entries: decided });
}
