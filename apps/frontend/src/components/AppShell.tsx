"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Agents", "/agents"],
  ["Orders", "/orders"],
  ["Payments", "/payments"],
  ["Invoices", "/invoices"],
  ["Contractors", "/contractors"],
  ["Policies", "/policies"],
  ["Audit", "/audit"],
  ["Proofs", "/proofs"],
  ["Settings", "/settings"],
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <strong>ArcPay</strong>
          <span>Somnia agent treasury</span>
        </Link>
        <nav className="nav">
          {nav.map(([label, href]) => (
            <Link key={href} className={pathname === href ? "active" : ""} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <span className="badge">Somnia Testnet</span>
            <span className="badge">Chain 50312</span>
          </div>
          <WalletButton />
        </div>
        {children}
      </main>
    </div>
  );
}
