"use client";

import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import deployment from "../../../../../deployments/somnia-testnet.json";

export const Route = createFileRoute("/proofs")({
  head: () => ({
    meta: [
      { title: "Proofs - ArcPay Somnia" },
      { name: "description", content: "Somnia contract deployment, worker, MCP, CLI, and frontend verification evidence." },
    ],
  }),
  component: ProofsPage,
});

type Status = "live" | "testnet" | "local";

const STATUS_STYLE: Record<Status, string> = {
  live: "bg-success/15 text-success",
  testnet: "bg-warning/25 text-warning-foreground",
  local: "bg-muted text-muted-foreground",
};

const CHECKS: { surface: string; status: Status; evidence: string }[] = [
  { surface: "Somnia Testnet contracts", status: "testnet", evidence: "AgentRegistry, TreasuryPolicy, AgentOrderBook, OperatorControls, RiskOracle, SpendCardVault, and PrivacyVault are deployed on chain 50312." },
  { surface: "Frontend", status: "live", evidence: "Next.js product UI builds successfully with Somnia-only wallet/auth/dashboard content." },
  { surface: "Worker", status: "live", evidence: "Azure systemd worker listens to Somnia order, card, and operator events from the deployed contracts." },
  { surface: "Tests", status: "local", evidence: "Hardhat test suite covers order lifecycle, approvals, emergency pause, weekly limit, cards, claim codes, circuit breakers, oracle, and privacy vault." },
  { surface: "Agent docs", status: "local", evidence: "skill.md and llms.txt describe how AI agents should interact with ArcPay." },
  { surface: "MCP and CLI", status: "local", evidence: "Repo includes MCP server and arcpay-somnia CLI commands for contracts, wallet, agent IDs, claim hashes, privacy guide, and MCP config." },
];

function ProofsPage() {
  const contracts = Object.entries((deployment as { contracts: Record<string, string> }).contracts);

  return (
    <MarketingShell navTone="light">
      <div className="px-6 pb-24 pt-16">
        <div className="mx-auto max-w-[88rem]">
          <SectionHeading
            eyebrow="Developer evidence"
            title={<>Proofs that match the <span className="text-primary">actual build</span>.</>}
            description="No placeholder provider checks. This page lists the Somnia contracts, local commands, worker, and docs that are actually present in the repo."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="border-b border-border px-6 py-4 text-sm font-semibold">Verification checklist</div>
              <div className="divide-y divide-border">
                {CHECKS.map((row) => (
                  <div key={row.surface} className="grid gap-3 px-6 py-4 md:grid-cols-[1fr_120px_1.8fr] md:items-center">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-success" /> {row.surface}
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[row.status]}`}>{row.status}</span>
                    </div>
                    <div className="text-sm leading-relaxed text-muted-foreground">{row.evidence}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6">
              <div className="text-sm font-semibold">Run locally</div>
              <div className="mt-4 space-y-3">
                {["npm run build:frontend", "npm test", "npm run check:worker"].map((cmd) => (
                  <code key={cmd} className="block rounded-2xl bg-muted px-4 py-3 text-sm">{cmd}</code>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                Network: Somnia Testnet, chain {String((deployment as { chainId: number }).chainId)}. Currency: STT.
              </div>
            </section>
          </div>

          <section className="mt-4 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4 text-sm font-semibold">Deployed contracts</div>
            <div className="divide-y divide-border">
              {contracts.map(([name, address]) => (
                <a
                  key={name}
                  href={`https://somnia-testnet.socialscan.io/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid gap-2 px-6 py-4 text-sm hover:bg-muted/50 md:grid-cols-[260px_1fr_24px] md:items-center"
                >
                  <span className="font-semibold">{name}</span>
                  <span className="font-mono text-muted-foreground">{address}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MarketingShell>
  );
}
