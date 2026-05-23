import { MarketingPage } from "@/components/StaticMarketingPage";
import { BookOpen, FileCode2, MonitorCheck, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <MarketingPage
      eyebrow="Docs"
      title="Everything judges need to verify."
      body="Use the Proofs page for deployment addresses, local commands, Supabase persistence, Azure worker status, and the Somnia testnet demo sequence."
      proof={["README", "skill.md", "llms.txt", "Proofs page"]}
      cards={[
        { title: "Local setup", body: "Install dependencies, compile contracts, run tests, and build the frontend from documented commands.", icon: Terminal },
        { title: "Deployment metadata", body: "Contract addresses are checked into `deployments/somnia-testnet.json` and linked from the UI.", icon: FileCode2 },
        { title: "Agent instructions", body: "`skill.md` and `llms.txt` explain how agents should use ArcPay Somnia safely.", icon: BookOpen },
        { title: "Live worker", body: "The Azure worker watches order, card, and operator-control events for operational proof.", icon: MonitorCheck },
      ]}
    />
  );
}
