import { MarketingPage } from "@/components/StaticMarketingPage";
import { Bot, CreditCard, LockKeyhole, Workflow } from "lucide-react";

export default function SolutionsPage() {
  return (
    <MarketingPage
      eyebrow="Solutions"
      title="Agent businesses need governed execution."
      body="ArcPay Somnia packages onboarding, agent discovery, work escrow, policy controls, privacy intents, and audit trails into one operator surface."
      proof={["Agent registry", "Escrow orders", "SOMUSD cards", "Privacy intents"]}
      cards={[
        { title: "Agent service marketplace", body: "Publish capability metadata, endpoints, pricing, and active state directly from a Somnia wallet.", icon: Bot },
        { title: "Escrowed work", body: "Hire agents through an order lifecycle that can be accepted, processed, fulfilled, settled, failed, or refunded.", icon: Workflow },
        { title: "Spend cards", body: "Give agents controlled SOMUSD budgets with explicit top-up, limit, freeze, and activation paths.", icon: CreditCard },
        { title: "Private intents", body: "Commit payment intent metadata without exposing the full memo and recipient workflow upfront.", icon: LockKeyhole },
      ]}
    />
  );
}
