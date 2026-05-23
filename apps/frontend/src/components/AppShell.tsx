"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  Blocks,
  Bot,
  CreditCard,
  ArrowLeftRight,
  Bell,
  Building2,
  ChevronDown,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Search,
  ReceiptText,
  ScrollText,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { WalletButton } from "./WalletButton";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, group: "Treasury" },
  { label: "Wallet", href: "/wallet", icon: Wallet, group: "Treasury" },
  { label: "Agents", href: "/agents", icon: Bot, group: "Treasury" },
  { label: "Orders", href: "/orders", icon: Workflow, group: "Treasury" },
  { label: "Cards", href: "/cards", icon: CreditCard, group: "Treasury" },
  { label: "Payments", href: "/payments", icon: Send, group: "Treasury" },
  { label: "Swaps", href: "/swaps", icon: ArrowLeftRight, group: "Treasury" },
  { label: "Yield", href: "/yield", icon: TrendingUp, group: "Treasury" },
  { label: "Invoices", href: "/invoices", icon: ReceiptText, group: "Operations" },
  { label: "Contractors", href: "/contractors", icon: Users, group: "Operations" },
  { label: "Risk", href: "/risk", icon: ShieldCheck, group: "Controls" },
  { label: "Policies", href: "/policies", icon: ShieldCheck, group: "Controls" },
  { label: "Privacy", href: "/privacy", icon: LockKeyhole, group: "Controls" },
  { label: "Operator", href: "/operator", icon: Blocks, group: "Controls" },
  { label: "Oracle", href: "/oracle", icon: Gauge, group: "Controls" },
  { label: "Audit", href: "/audit", icon: ScrollText, group: "Proof" },
  { label: "Proofs", href: "/proofs", icon: BadgeCheck, group: "Proof" },
  { label: "Profile", href: "/profile", icon: Users, group: "Proof" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Proof" },
] as const;

const groups = ["Treasury", "Operations", "Controls", "Proof"] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/dashboard">
          <span className="brand-mark">⌁</span>
          <span>
            <strong>ArcPay</strong>
            <em>Somnia agent treasury</em>
          </span>
        </Link>

        <div className="sidebar-card">
          <div className="sidebar-card-icon"><Sparkles size={16} /></div>
          <div>
            <strong>Agentic L1 mode</strong>
            <p>Fixed to Somnia Testnet for judge-safe demos.</p>
          </div>
        </div>

        <nav className="app-nav">
          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <span>{group}</span>
              {nav.filter((item) => item.group === group).map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} className={active ? "active" : ""} href={item.href}>
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <section className="app-frame">
        <header className="app-topbar">
          <div className="workspace-pill">
            <Building2 size={16} />
            <span>ArcPay Labs</span>
            <ChevronDown size={14} />
          </div>
          <div className="network-pills">
            <span>Somnia Testnet</span>
            <span>Chain 50312</span>
            <span>STT</span>
          </div>
          <button className="topbar-search" type="button" aria-label="Search">
            <Search size={16} />
            <span>Jump to...</span>
            <kbd>⌘K</kbd>
          </button>
          <button className="topbar-icon" type="button" aria-label="Notifications">
            <Bell size={16} />
            <i />
          </button>
          <WalletButton />
        </header>

        <main className="app-main">{children}</main>
      </section>
    </div>
  );
}
