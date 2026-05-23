import Link from "next/link";
import { ArrowRight, Bot, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";

const steps = [
  ["Connect Somnia wallet", "Switch to chain 50312 and create a wallet-first operator session.", Wallet],
  ["Register an agent", "Publish capabilities, endpoint, price, and owner on the AgentRegistry.", Bot],
  ["Set spend policy", "Configure limits, approval thresholds, allowlists, windows, and emergency pause.", ShieldCheck],
  ["Issue SOMUSD card", "Fund and control agent budgets without exposing the whole treasury.", CreditCard],
] as const;

export default function OnboardPage() {
  return (
    <AuthShell
      heading="Start the Somnia workspace."
      subheading="ArcPay uses wallet-first onboarding: connect a Somnia wallet, then add email later if you want secondary login."
    >
      <div className="onboard-card">
        <span>Somnia Testnet</span>
        <h1>Launch the agent treasury flow.</h1>
        <p>Use this path for judge demos: wallet, agent registry, policy, order, card, privacy, proof.</p>
        <div className="onboard-steps">
          {steps.map(([title, body, Icon]) => (
            <article key={title}>
              <Icon size={18} />
              <div>
                <strong>{title}</strong>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="onboard-actions">
          <Link className="auth-big-link" href="/sign-up">Create workspace <ArrowRight size={18} /></Link>
          <Link href="/sign-in">I already have access</Link>
        </div>
      </div>
    </AuthShell>
  );
}
