import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Connectors() {
  const [connectors, setConnectors] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cRes, rRes] = await Promise.all([
        fetch("/api/connectors"),
        fetch("/api/requests"),
      ]);
      const c = await cRes.json();
      const r = await rRes.json();
      setConnectors(c.connectors);
      setPendingCount(r.requests.filter((x) => x.status === "pending").length);
      setLoading(false);
    }
    load();
  }, []);

  async function toggle(id, enabled) {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled } : c))
    );
    await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled }),
    });
  }

  return (
    <Layout pendingCount={pendingCount}>
      <div className="page-head">
        <h1>Connectors</h1>
        <p>Turn a system on to let requests for it reach the queue.</p>
      </div>
      <div className="card">
        {loading ? (
          <div className="empty">Loading…</div>
        ) : (
          connectors.map((c) => (
            <div className="connector-row" key={c.id}>
              <span className="connector-name">{c.name}</span>
              <button
                className={`switch ${c.enabled ? "on" : ""}`}
                onClick={() => toggle(c.id, !c.enabled)}
                aria-label={`Toggle ${c.name}`}
              />
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
