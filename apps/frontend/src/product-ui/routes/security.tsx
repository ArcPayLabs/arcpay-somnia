// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, KeyRound, Lock, FileSearch, AlertTriangle, ServerCog } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SectionHeading } from "@/components/primitives/SectionHeading";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security - ArcPay" },
      { name: "description", content: "How ArcPay handles custody, signing, privacy, and audit on Somnia." },
      { property: "og:title", content: "Security - ArcPay" },
      { property: "og:description", content: "Custody, signing, privacy, and audit, explained honestly." },
    ],
  }),
  component: SecurityPage,
});

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Non-custodial",
    body: "ArcPay never holds keys. Signing happens in your wallet, or via Policy signer dWallet policy approval when enabled.",
  },
  {
    icon: KeyRound,
    title: "Viewing keys, not surveillance",
    body: "Auditors get scoped, expiring viewing keys per disclosure scope. The public ledger doesn't expose per-agent revenue.",
  },
  {
    icon: Lock,
    title: "Shielded rails when live",
    body: "Privacy Vault (testnet today) and private intent routes prepare incoming and outgoing funds. We label testnet as testnet, with no production claims on rails that are not live.",
  },
  {
    icon: FileSearch,
    title: "Date-range audit exports",
    body: "Every action, including payment, swap, yield deposit, and policy change, is exported with the matching transaction signature.",
  },
  {
    icon: AlertTriangle,
    title: "Policy-enforced spend",
    body: "Daily limits, per-tx caps, allowed tokens, blocked actions, minimum Somnia risk oracle score, contractor allowlist, emergency pause.",
  },
  {
    icon: ServerCog,
    title: "Final-review modal, always",
    body: "Network, wallet, token, amount, fees, route, slippage, and recipient are confirmed before every money-moving signature.",
  },
];

function SecurityPage() {
  return (
    <MarketingShell navTone="light">
      <div className="px-6 pt-16 pb-24">
        <div className="max-w-[88rem] mx-auto">
          <SectionHeading
            align="center"
            eyebrow="Security"
            title={<>What we secure, and how <span className="text-primary">honestly</span>.</>}
            description="ArcPay is a control plane, not a custodian. We say what's live, what's pre-alpha, and what's still pending."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {ITEMS.map((i) => (
              <div key={i.title} className="rounded-3xl border border-border bg-card p-7">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <i.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold">{i.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}

