import Link from "next/link";
import { Bot, Gauge, ShieldAlert, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function RiskPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agent risk"
        title="Somnia risk intelligence"
        description="ArcPay Somnia turns risk review into an agent-oracle flow: request a score, receive a verdict, and gate treasury spend before settlement."
        badges={["Somnia oracle", "Policy-aware", "Judge demo fallback"]}
      />
      <section className="risk-layout section">
        <article className="risk-primary">
          <span>Risk flow</span>
          <h2>Ask the oracle before treasury funds move.</h2>
          <p>The risk page is the operator-facing explanation of the live oracle route. Use `/oracle` to create a contract request, then use policies to enforce the result before order settlement.</p>
          <div className="risk-steps">
            <div><b>01</b><strong>Create risk request</strong><p>Attach an order ID and prompt to the SomniaAgentRiskOracle contract.</p></div>
            <div><b>02</b><strong>Receive verdict</strong><p>Store score, verdict, evidence URI, and fulfilled state onchain.</p></div>
            <div><b>03</b><strong>Gate spend</strong><p>Use policy thresholds and approvals to stop risky settlement paths.</p></div>
          </div>
        </article>
        <aside className="risk-actions">
          <Link href="/oracle"><Gauge /> Open oracle</Link>
          <Link href="/policies"><SlidersHorizontal /> Open policies</Link>
          <Link href="/orders"><Bot /> Review orders</Link>
        </aside>
        <article className="risk-card"><ShieldAlert /><h2>Policy gate</h2><p>TreasuryPolicy blocks spend through limits, allowlists, time windows, approval thresholds, and emergency pause.</p></article>
        <article className="risk-card"><Bot /><h2>Agent-native review</h2><p>Risk prompts can be routed to Somnia agent infrastructure where available, or fulfilled through the demo owner path for judging.</p></article>
      </section>
    </>
  );
}
