import { ArrowLeftRight, Bot, Route } from "lucide-react";
import { AppPage } from "@/components/AppPage";

export default function SwapsPage() {
  return (
    <AppPage
      eyebrow="Treasury routing"
      title="Swap intents for Somnia"
      description="ArcPay exposes swap intents as policy-checked agent tasks, ready for a Somnia router adapter when a stable production route is available."
      badges={["Intent-first", "No fake fills", "Agent executable"]}
      cards={[
        { title: "Swap intent", body: "Operators can prepare a route request for an agent or future Somnia DEX adapter to execute under treasury policy.", icon: ArrowLeftRight },
        { title: "Execution guardrails", body: "Slippage, recipient, and token route checks should be added before a live router adapter is enabled.", icon: Route },
        { title: "Agent path", body: "Autonomous agents can receive swap intents as escrowed work orders and return result URIs or execution proof.", icon: Bot },
      ]}
    />
  );
}
