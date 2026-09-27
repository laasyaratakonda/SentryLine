import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children, pendingCount = 0 }) {
  const router = useRouter();

  const items = [
    { href: "/", label: "Queue", badge: pendingCount || null },
    { href: "/audit", label: "Audit log" },
    { href: "/connectors", label: "Connectors" },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark" />
          <span className="brand-name">PrivacyFence</span>
        </div>
        <nav className="nav">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "active" : ""}
            >
              <span>{item.label}</span>
              {item.badge ? <span className="count">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          Demo mode — simulated requests, no live AI client connected.
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
