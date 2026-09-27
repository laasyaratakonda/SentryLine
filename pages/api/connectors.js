import { store, toggleConnector } from "../../lib/store";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ connectors: store.connectors });
  }
  if (req.method === "POST") {
    const { id, enabled } = req.body || {};
    const updated = toggleConnector(id, enabled);
    if (!updated) return res.status(404).json({ error: "Connector not found" });
    return res.status(200).json({ connector: updated });
  }
  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method not allowed" });
}
