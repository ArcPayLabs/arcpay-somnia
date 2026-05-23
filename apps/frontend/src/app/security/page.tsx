import { MarketingPage } from "@/components/StaticMarketingPage";
import { Clock, OctagonAlert, ShieldCheck, Users } from "lucide-react";

export default function SecurityPage() {
  return (
    <MarketingPage
      eyebrow="Security"
      title="Policy before signature."
      body="Spending limits, allowed agents, approval thresholds, time windows, circuit breakers, and emergency pause controls are built into the contract and UI flow."
      proof={["Hourly limit", "Daily limit", "Weekly limit", "Emergency pause"]}
      cards={[
        { title: "Time windows", body: "Restrict execution to UTC operating windows so autonomous spend cannot run outside policy.", icon: Clock },
        { title: "Agent allowlist", body: "Only approved agent IDs can receive governed orders when allowlist mode is enabled.", icon: Users },
        { title: "Emergency pause", body: "Stop spend globally for an operator before orders or card actions move further.", icon: OctagonAlert },
        { title: "Approval thresholds", body: "High-value orders require explicit operator approval before settlement can proceed.", icon: ShieldCheck },
      ]}
    />
  );
}
