import Link from "next/link";
import { Bot, Gauge, ShieldAlert } from "lucide-react";
import { AppPage } from "@/components/AppPage";

export default function RiskPage() {
  return (
    <AppPage
      eyebrow="Agent risk"
      title="Somnia risk intelligence"
      description="ArcPay Somnia turns risk review into an agent-oracle flow: request a score, receive a verdict, and gate treasury spend before settlement."
      badges={["Somnia oracle", "Policy-aware", "Judge demo fallback"]}
      cards={[
        { title: "Risk oracle", body: "Use the SomniaAgentRiskOracle contract to request and fulfill counterparty or order risk decisions.", icon: Gauge, action: <Link className="button-link" href="/oracle">Open oracle</Link> },
        { title: "Policy gate", body: "TreasuryPolicy blocks spend through limits, allowlists, time windows, approval thresholds, and emergency pause.", icon: ShieldAlert, action: <Link className="button-link secondary" href="/policies">Open policies</Link> },
        { title: "Agent-native review", body: "Risk prompts can be routed to the Somnia agent platform where available, or fulfilled through the demo owner path for judging.", icon: Bot },
      ]}
    />
  );
}
