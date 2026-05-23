import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, CreditCard, FileCheck2, LockKeyhole, MonitorCheck, Server, ShieldCheck, Wallet, Workflow, Zap } from "lucide-react";
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
const stack = [
  ["Wallet", "EVM wallet signatures, Somnia chain lock, message auth.", Wallet],
  ["Contracts", "Registry, policy, order book, controls, cards, oracle, privacy vault.", BadgeCheck],
  ["Worker", "Azure systemd worker watches order, card, and operator-control events.", Server],
  ["Proof", "Deployment file, explorer links, build commands, and judge demo path.", MonitorCheck],
] as const;
const how = [
  ["01", "Operator connects", "Wallet auth locks the session to Somnia Testnet and keeps signing explicit."],
  ["02", "Agent registers", "Services publish capabilities, endpoint, price, owner, and active state onchain."],
  ["03", "Policy gates spend", "Hourly, daily, weekly, allowlist, threshold, and pause controls guard movement."],
  ["04", "Work settles", "Orders move from escrow to fulfillment, settlement, refund, or audit proof."],
] as const;
const faq = [
  ["Is this Somnia-only?", "This repo is fixed to Somnia Testnet. No alternate-chain switch is exposed here."],
  ["Are swaps and yield faked?", "No. Those pages save policy-ready intents until a stable Somnia router or vault adapter is selected."],
  ["What makes it agent-first?", "Agents can be registered, discovered, hired, escrowed, scored, budgeted with cards, and audited."],
  ["What can judges verify?", "Contracts, explorer links, wallet transactions, Supabase records, CLI/MCP docs, and Azure worker status."],
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
              <Link className="hero-primary" href="/onboard">
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
          {how.map(([step, title, body]) => (
            <li key={step}><b>{step}</b><span><strong>{title}</strong>{body}</span></li>
          ))}
        </ol>
      </section>

      <section className="landing-showcase">
        <article>
          <span>Operator console</span>
          <h2>Not just connect-wallet UI.</h2>
          <p>The app surface covers agents, orders, SOMUSD cards, direct STT payments, invoices, contractors, policy, privacy, oracle, proofs, profile, and settings.</p>
          <div>
            <Link href="/dashboard">Open dashboard</Link>
            <Link href="/agents">Register agent</Link>
            <Link href="/privacy">Create privacy intent</Link>
          </div>
        </article>
        <aside>
          <div><Zap /><strong>50312</strong><span>Somnia chain ID</span></div>
          <div><FileCheck2 /><strong>8</strong><span>Contracts deployed</span></div>
          <div><CreditCard /><strong>SOMUSD</strong><span>Agent cards</span></div>
          <div><LockKeyhole /><strong>Vault</strong><span>Privacy intents</span></div>
        </aside>
      </section>

      <section className="landing-stack">
        <div className="section-heading">
          <span>Architecture</span>
          <h2>Built like a real agent treasury, not a landing-page mock.</h2>
          <p>Every visible module maps to a contract, wallet action, persisted record, or documented integration path.</p>
        </div>
        <div className="stack-grid">
          {stack.map(([title, body, Icon]) => (
            <article key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-proof-band">
        <div>
          <span>Live Somnia Testnet</span>
          <strong>8 deployed contracts</strong>
          <p>AgentRegistry, TreasuryPolicy, AgentTreasury, AgentOrderBook, OperatorControls, SomniaAgentRiskOracle, AgentSpendCardVault, and SomniaPrivacyVault.</p>
        </div>
        <div>
          <span>Operational backend</span>
          <strong>Azure worker active</strong>
          <p>The worker follows contract events and restarts on VM reboot, giving judges a backend proof surface.</p>
        </div>
        <div>
          <span>Shared persistence</span>
          <strong>Supabase isolated tables</strong>
          <p>Somnia records are separated from Sui, Mantle, and Arbitrum while using one Supabase project.</p>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <span>Start testing</span>
          <h2>Open the app, connect Somnia, and run the demo path.</h2>
          <p>Register an agent, set policy, create an order, issue a card, create a privacy intent, and export proof.</p>
        </div>
        <Link className="hero-primary" href="/dashboard">Open App <span><ArrowRight size={18} /></span></Link>
      </section>

      <section className="landing-faq">
        <div className="section-heading">
          <span>Judge notes</span>
          <h2>Clear boundaries, live pieces, no fake production-network claims.</h2>
        </div>
        <div>
          {faq.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="marketing-footer">
        <div>
          <strong>ArcPay</strong>
          <span>Private treasury OS for autonomous agents on Somnia.</span>
        </div>
        <nav>
          <Link href="/docs">Docs</Link>
          <Link href="/proofs">Proofs</Link>
          <Link href="/dashboard">Open App</Link>
        </nav>
      </footer>
    </main>
  );
}
