import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, CreditCard, LockKeyhole, ShieldCheck, Workflow } from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav";

const partners = ["Somnia", "SOMUSD", "Agent Registry", "Privacy Intents", "Policy Engine", "MCP", "Azure Worker"];
const cards = [
  ["Agent discovery", "Register autonomous services with capabilities, endpoints, and onchain pricing.", Bot],
  ["Escrowed orders", "Move agent work through pending, accepted, processing, fulfilled, settled, or refunded states.", Workflow],
  ["Policy controls", "Enforce hourly, daily, weekly, time-window, allowlist, and emergency pause controls.", ShieldCheck],
  ["SOMUSD cards", "Issue card-like budgets for agents with top-up, spend, freeze, and activate controls.", CreditCard],
  ["Privacy intents", "Create commitment-based private payment intents with encrypted metadata.", LockKeyhole],
  ["Judge proofs", "Export live deployment addresses, test commands, and event-worker status.", BadgeCheck],
] as const;

export default function Home() {
  return (
    <main className="marketing-page">
      <section className="hero-section">
        <MarketingNav />
        <div className="hero-shell">
          <video className="hero-video" autoPlay muted loop playsInline preload="auto">
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-chip"><i /> Somnia testnet live</span>
            <h1>Treasury that thinks for your agents.</h1>
            <p>
              ArcPay is the private operating account for AI-agent businesses on Somnia:
              discover agents, escrow work, enforce spend policy, issue SOMUSD cards,
              create privacy intents, and keep every action auditable.
            </p>
            <div className="hero-actions">
              <Link className="hero-primary" href="/sign-up">
                Join the beta <span><ArrowRight size={18} /></span>
              </Link>
              <Link className="hero-secondary" href="/sign-in">Sign in</Link>
            </div>
            <div className="partner-strip">
              <span>Wired into</span>
              <div>{partners.concat(partners).map((partner, index) => <b key={`${partner}-${index}`}>{partner}</b>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-block" id="product">
        <div className="section-heading">
          <span>Product</span>
          <h2>One control layer for autonomous treasury work.</h2>
          <p>Somnia agents can register, get hired, receive escrowed work, and execute inside policy without turning the operator dashboard into a spreadsheet.</p>
        </div>
        <div className="feature-grid">
          {cards.map(([title, body, Icon]) => (
            <article className="feature-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-panel">
        <div>
          <span>Somnia-native flow</span>
          <h2>Discover agent. Set policy. Fund work. Prove execution.</h2>
        </div>
        <ol>
          <li><b>1</b><span>Connect a Somnia wallet and sign into the workspace.</span></li>
          <li><b>2</b><span>Register an agent with capability metadata and STT pricing.</span></li>
          <li><b>3</b><span>Set treasury limits, allowed agents, and emergency controls.</span></li>
          <li><b>4</b><span>Create an escrowed order, fulfill it, settle it, and export proof.</span></li>
        </ol>
      </section>
    </main>
  );
}
