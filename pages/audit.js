import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { timeAgo } from "../lib/time";

export default function Audit() {
  const [entries, setEntries] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [auditRes, reqRes] = await Promise.all([
        fetch("/api/audit"),
        fetch("/api/requests"),
      ]);
      const audit = await auditRes.json();
      const reqs = await reqRes.json();
      setEntries(audit.entries);
      setPendingCount(reqs.requests.filter((r) => r.status === "pending").length);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Layout pendingCount={pendingCount}>
      <div className="page-head">
        <h1>Audit log</h1>
        <p>Every decision made on a request, kept for later review.</p>
      </div>
      <div className="card">
        {loading ? (
          <div className="empty">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="empty">No decisions yet. Approve or deny something in the queue.</div>
        ) : (
          entries.map((r) => (
            <div className="request-row" key={r.id}>
              <div className="request-body">
                <div className="request-top">
                  <span className="chip">{r.connector}</span>
                  <span className="request-tool">{r.tool}</span>
                  <span className="request-target">{r.target}</span>
                </div>
                <div className="request-reason">{r.reason}</div>
              </div>
              <div className="request-time">{timeAgo(r.decidedAt || r.time)}</div>
              <span className={`status-pill ${r.status}`}>{r.status}</span>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
