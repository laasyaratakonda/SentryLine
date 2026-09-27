import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { timeAgo } from "../lib/time";

export default function Queue() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(data.requests);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id, decision) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
    );
    await fetch(`/api/requests/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
  }

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <Layout pendingCount={pending.length}>
      <div className="page-head">
        <h1>Queue</h1>
        <p>Requests an AI assistant wants to run, waiting on your decision.</p>
      </div>
      <div className="card">
        {loading ? (
          <div className="empty">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="empty">Nothing waiting on you. New requests will show up here.</div>
        ) : (
          pending.map((r) => (
            <div className="request-row" key={r.id}>
              <div className="request-body">
                <div className="request-top">
                  <span className="chip">{r.connector}</span>
                  <span className="request-tool">{r.tool}</span>
                  <span className="request-target">{r.target}</span>
                </div>
                <div className="request-reason">{r.reason}</div>
                {r.riskNote && (
                  <div className="risk-note">
                    <span className="risk-dot" />
                    {r.riskNote}
                  </div>
                )}
              </div>
              <div className="request-time">{timeAgo(r.time)}</div>
              <div className="actions">
                <button className="btn approve" onClick={() => decide(r.id, "approved")}>
                  Approve
                </button>
                <button className="btn deny" onClick={() => decide(r.id, "denied")}>
                  Deny
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
