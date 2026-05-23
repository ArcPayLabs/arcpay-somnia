import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BadgeCheck, ShieldCheck, Workflow } from "lucide-react";
import { MarketingNav } from "./MarketingNav";

export function MarketingPage({
  eyebrow,
  title,
  body,
  proof,
  cards,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly proof: readonly string[];
  readonly cards: readonly { readonly title: string; readonly body: string; readonly icon: LucideIcon }[];
}) {
  return (
    <main className="marketing-page">
      <MarketingNav />
      <section className="static-hero">
        <div>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{body}</p>
          <div className="static-actions">
            <Link className="hero-primary" href="/dashboard">Open App <span><ArrowRight size={18} /></span></Link>
            <Link className="hero-secondary" href="/">Back home</Link>
          </div>
        </div>
        <aside>
          <strong>Somnia Testnet</strong>
          <p>Live contracts, wallet signatures, and event-worker monitoring are wired for judge testing.</p>
          <div>
            {proof.map((item) => <span key={item}>{item}</span>)}
          </div>
        </aside>
      </section>

      <section className="static-grid">
        {cards.map((card) => (
          <article key={card.title}>
            <card.icon />
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className="static-proof">
        <div><Workflow /><span>Workflow</span><strong>Discover, govern, execute, audit.</strong></div>
        <div><ShieldCheck /><span>Controls</span><strong>Policy before every spend path.</strong></div>
        <div><BadgeCheck /><span>Proof</span><strong>Explorer links and local commands included.</strong></div>
      </section>
    </main>
  );
}
