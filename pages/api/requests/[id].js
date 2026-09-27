import { decideRequest } from "../../../lib/store";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id } = req.query;
  const { decision } = req.body || {};
  if (decision !== "approved" && decision !== "denied") {
    return res.status(400).json({ error: "decision must be 'approved' or 'denied'" });
  }
  const updated = decideRequest(id, decision);
  if (!updated) {
    return res.status(404).json({ error: "Request not found" });
  }
  res.status(200).json({ request: updated });
}
