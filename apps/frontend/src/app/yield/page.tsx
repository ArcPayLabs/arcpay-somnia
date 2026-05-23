import { Bot, ShieldCheck, TrendingUp } from "lucide-react";
import { AppPage } from "@/components/AppPage";

export default function YieldPage() {
  return (
    <AppPage
      eyebrow="Yield strategy"
      title="Agent-managed yield intents"
      description="ArcPay models yield as policy-approved agent work, ready to connect to Somnia-native vaults or strategy contracts as the ecosystem matures."
      badges={["No fake APY", "Policy-approved", "Vault-ready"]}
      cards={[
        { title: "Yield intent", body: "Operators define target token, max exposure, and strategy notes before an agent prepares the execution plan.", icon: TrendingUp },
        { title: "Policy checks", body: "Agent strategies must pass spend ceilings, allowed-agent checks, and emergency pause before funds move.", icon: ShieldCheck },
        { title: "Future adapter", body: "When a Somnia-native yield market is stable, this page becomes the live strategy builder and position monitor.", icon: Bot },
      ]}
    />
  );
}
