"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  CreditCard,
  Lock,
  Route,
  Send,
  ShieldAlert,
  Sparkles,
  Wallet,
  Workflow,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RecordTable } from "@/components/RecordTable";
import { StatCard } from "@/components/StatCard";
import { CONTRACTS, SOMNIA_EXPLORER_URL, SOMNIA_RPC_URL, addressUrl, balances, connectedAddress, readRecords, shortAddress, type LocalRecord } from "@/lib/somnia";

type Activity = {
  id: string;
  kind: "in" | "out" | "agent" | "privacy";
  who: string;
  amt: string;
  time: string;
  amount: number;
  direction: "in" | "out";
  createdAt: string;
};

export default function DashboardPage() {
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const rows = readRecords();
    setRecords(rows);
    connectedAddress()
      .then(async (address) => {
        setWallet(address);
        setBalance(await balances(address));
      })
      .catch(() => undefined);
  }, []);

  const activity = useMemo(() => records.slice(0, 12).map(toActivity), [records]);
  const flow = useMemo(() => buildFlow(activity), [activity]);
  const pending = records.filter((record) => ["pending", "escrowed", "requested"].includes(record.status.toLowerCase()));
  const alerts = records.filter((record) => record.type === "audit" || record.status.toLowerCase().includes("failed")).slice(0, 4);
  const counts = {
    payments: records.filter((record) => record.type === "payment").length,
    invoices: records.filter((record) => record.type === "invoice").length,
    contractors: records.filter((record) => record.type === "contractor").length,
    privacy: records.filter((record) => record.type === "privacy").length,
  };

  return (
    <div className="dashboard-stack">
      <div className="dashboard-head">
        <div>
          <div className="dash-eyebrow">Overview <span>Somnia Testnet</span></div>
          <h1>Good morning, operator.</h1>
          <p>Private treasury OS for autonomous agents: wallet-signed STT payments, escrowed work, SOMUSD cards, policy controls, privacy intents, and proof exports.</p>
        </div>
        <Link className="dash-primary-action" href="/payments"><Send size={16} /> New payment</Link>
      </div>

      <div className="next-action">
        <div className="next-icon"><Sparkles size={20} /></div>
        <div>
          <strong>Next best action</strong>
          <p>{wallet ? `${shortAddress(wallet)} has ${Number(balance ?? 0).toFixed(4)} STT. Register an agent, set policy, then create an escrow order.` : "Connect a Somnia wallet to load live balance and start the guided agent treasury flow."}</p>
        </div>
        <Link href={wallet ? "/agents" : "/wallet"}>{wallet ? "Register agent" : "Connect wallet"}</Link>
      </div>

      <div className="stat-grid four">
        <StatCard icon={Wallet} label="Operating" value={wallet ? `${Number(balance ?? 0).toFixed(4)} STT` : "--"} hint={wallet ? "Live Somnia wallet balance" : "Connect wallet to load balance"} />
        <StatCard icon={Workflow} label="Agent orders" value={counts.payments} hint="Escrow and direct payment records" delta={{ value: "policy-gated", direction: "up" }} />
        <StatCard icon={CreditCard} label="SOMUSD cards" value={records.filter((record) => record.title.toLowerCase().includes("card")).length} hint="Agent card events" />
        <StatCard icon={Lock} label="Privacy intents" value={counts.privacy} hint="Commitment-based private payment intents" emphasis />
      </div>

      <div className="stat-grid three">
        <StatCard icon={Bot} label="Contractors" value={counts.contractors} hint="Agent and human workforce records" />
        <StatCard icon={ShieldAlert} label="Policy queue" value={pending.length} hint={pending.length ? "Review pending treasury actions" : "No pending approvals"} />
        <StatCard icon={Route} label="Live contracts" value={Object.keys(CONTRACTS).length} hint="Deployed to Somnia Testnet" />
      </div>

      <section className="dashboard-grid">
        <div className="dash-panel wide">
          <div className="panel-heading">
            <div><span>24h flow</span><h2>Inflow vs outflow</h2></div>
            <div className="legend"><i /> Inflow <b /> Outflow</div>
          </div>
          <div className="chart-box">{flow.length ? <FlowChart data={flow} /> : <Empty icon={Wallet} text="Create payments, invoices, orders, or privacy intents to populate treasury flow." />}</div>
        </div>

        <div className="dash-panel">
          <div className="panel-heading"><div><span>Pending approvals</span><h2>Review queue</h2></div></div>
          <div className="approval-list">
            {pending.length ? pending.slice(0, 5).map((record) => (
              <div className="approval-row" key={record.id}>
                <div><strong>{record.title}</strong><span>{record.amount ?? record.type}</span></div>
                <em>Review</em>
              </div>
            )) : <Empty icon={CheckCircle2} text="Nothing pending." />}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dash-panel wide">
          <div className="panel-heading">
            <div><span>Latest activity</span><h2>Treasury feed</h2></div>
            <Link href="/audit">View all</Link>
          </div>
          {activity.length ? (
            <div className="feed-list">
              {activity.map((row) => (
                <div className="feed-row" key={row.id}>
                  <div className={`feed-icon ${row.kind}`}>{row.kind === "in" ? <ArrowDownLeft size={16} /> : row.kind === "out" ? <ArrowUpRight size={16} /> : row.kind === "privacy" ? <Lock size={16} /> : <Bot size={16} />}</div>
                  <div><strong>{row.who}</strong><span>{row.time} - Somnia Testnet</span></div>
                  <code>{row.amt}</code>
                </div>
              ))}
            </div>
          ) : <RecordTable />}
        </div>

        <div className="dash-panel">
          <div className="panel-heading"><div><span>Risk alerts</span><h2>Controls</h2></div></div>
          <div className="alert-list">
            {alerts.length ? alerts.map((record) => (
              <div className="alert-row" key={record.id}>
                <AlertTriangle size={16} />
                <div><strong>{record.title}</strong><span>{record.status}</span></div>
              </div>
            )) : <Empty icon={BadgeCheck} text="No active alerts from saved records." />}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dash-panel wide">
          <div className="panel-heading"><div><span>Deployment</span><h2>Somnia contract map</h2></div></div>
          <div className="contract-list">
            {Object.entries(CONTRACTS).map(([name, address]) => (
              <a href={addressUrl(address)} key={name} target="_blank" rel="noreferrer"><span>{name}</span><code>{address}</code></a>
            ))}
          </div>
        </div>
        <div className="dash-panel">
          <div className="panel-heading"><div><span>Runtime</span><h2>Network</h2></div></div>
          <div className="dense-grid">
            <div className="kv"><span>Network</span><strong>Somnia Testnet</strong></div>
            <div className="kv"><span>Chain ID</span><strong>50312 / 0xc488</strong></div>
            <div className="kv"><span>RPC</span><code>{SOMNIA_RPC_URL}</code></div>
            <div className="kv"><span>Explorer</span><a href={SOMNIA_EXPLORER_URL} target="_blank" rel="noreferrer">{SOMNIA_EXPLORER_URL}</a></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Empty({ icon: Icon, text }: { readonly icon: typeof Wallet; readonly text: string }) {
  return <div className="empty-state"><Icon size={32} /><span>{text}</span></div>;
}

function toActivity(record: LocalRecord): Activity {
  const amount = readMoney(record.amount ?? "");
  const kind = record.type === "privacy" ? "privacy" : record.type === "payment" ? "out" : record.type === "contractor" ? "agent" : "in";
  return {
    id: record.id,
    kind,
    who: record.title,
    amt: record.amount ?? record.type,
    time: relativeTime(record.createdAt),
    amount,
    direction: kind === "out" || kind === "privacy" ? "out" : "in",
    createdAt: record.createdAt,
  };
}

function FlowChart({ data }: { readonly data: readonly { t: string; in: number; out: number }[] }) {
  const width = 760;
  const height = 240;
  const padX = 28;
  const padY = 22;
  const max = Math.max(1, ...data.flatMap((row) => [row.in, row.out]));
  const points = (key: "in" | "out") => data.map((row, index) => {
    const x = padX + (index / Math.max(1, data.length - 1)) * (width - padX * 2);
    const y = height - padY - (row[key] / max) * (height - padY * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className="flow-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((ratio) => <line key={ratio} x1={padX} x2={width - padX} y1={height * ratio} y2={height * ratio} />)}
      <polyline points={points("in")} className="line-in" />
      <polyline points={points("out")} className="line-out" />
    </svg>
  );
}

function buildFlow(activity: readonly Activity[]) {
  const now = new Date();
  const buckets = Array.from({ length: 8 }, (_, index) => {
    const hour = new Date(now.getTime() - (7 - index) * 3 * 60 * 60 * 1000);
    return { t: hour.getHours().toString().padStart(2, "0"), in: 0, out: 0 };
  });
  for (const item of activity) {
    const ageHours = (now.getTime() - Date.parse(item.createdAt)) / 3_600_000;
    if (ageHours < 0 || ageHours > 24) continue;
    const index = Math.min(7, Math.max(0, 7 - Math.floor(ageHours / 3)));
    buckets[index]![item.direction] += item.amount || 1;
  }
  return buckets;
}

function readMoney(value: string) {
  const match = value.replaceAll(",", "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function relativeTime(value: string) {
  const delta = Date.now() - Date.parse(value);
  if (!Number.isFinite(delta)) return new Date(value).toLocaleString();
  const minutes = Math.max(0, Math.floor(delta / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
