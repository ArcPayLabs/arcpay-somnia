import { MarketingPage } from "@/components/StaticMarketingPage";
import { BadgeDollarSign, FlaskConical, Server, Wallet } from "lucide-react";

export default function PricingPage() {
  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Built for testnet evaluation."
      body="ArcPay Somnia is open for hackathon testing. Operators only need Somnia testnet STT and optional SOMUSD test tokens to run the full demo path."
      proof={["No platform fee", "Testnet STT", "SOMUSD optional", "Open repo"]}
      cards={[
        { title: "Operator testing", body: "Run the app with testnet wallet funds and verify every contract write on the Somnia explorer.", icon: Wallet },
        { title: "Agent work orders", body: "Escrowed orders use STT for demo settlement and state-machine verification.", icon: BadgeDollarSign },
        { title: "Hosted worker", body: "Azure worker logs contract events without requiring a judge to run backend services locally.", icon: Server },
        { title: "Buildathon mode", body: "Pricing is intentionally simple: prove utility first, then convert to usage-based fees later.", icon: FlaskConical },
      ]}
    />
  );
}
