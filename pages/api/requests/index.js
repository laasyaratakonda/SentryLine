import { store } from "../../../lib/store";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const sorted = [...store.requests].sort((a, b) => b.time - a.time);
  res.status(200).json({ requests: sorted });
}
