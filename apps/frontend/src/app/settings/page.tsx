import { PageHeader } from "@/components/PageHeader";
import { BadgeCheck, Database, Network, Server } from "lucide-react";
import { CONTRACTS, SOMNIA_CHAIN_ID, SOMNIA_EXPLORER_URL, SOMNIA_RPC_URL } from "@/lib/somnia";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Testnet configuration"
        title="Somnia-only runtime"
        description="This build is fixed to Somnia Testnet so the hackathon demo is deterministic and every transaction points to Somnia infrastructure."
        badges={["Somnia Testnet", "EVM wallet", "Somnia RPC"]}
      />
      <section className="grid section">
        <div className="panel third stat">
          <Network />
          <span className="eyebrow">Network</span>
          <strong>50312</strong>
          <p className="muted">Fixed Somnia Testnet configuration for hackathon testing.</p>
        </div>
        <div className="panel third stat">
          <Database />
          <span className="eyebrow">Persistence</span>
          <strong>Supabase</strong>
          <p className="muted">Somnia records stay isolated from Sui, Mantle, and Arbitrum tables.</p>
        </div>
        <div className="panel third stat">
          <Server />
          <span className="eyebrow">Worker</span>
          <strong>Azure</strong>
          <p className="muted">Event worker runs separately from Vercel for operational proofs.</p>
        </div>

        <div className="panel">
          <h2>Network</h2>
          <div className="kv"><span>Chain ID</span><strong>{SOMNIA_CHAIN_ID}</strong></div>
          <div className="kv"><span>RPC</span><code>{SOMNIA_RPC_URL}</code></div>
          <div className="kv"><span>Explorer</span><a href={SOMNIA_EXPLORER_URL} target="_blank" rel="noreferrer">{SOMNIA_EXPLORER_URL}</a></div>
          <div className="kv"><span>Currency</span><strong>STT</strong></div>
        </div>
        <div className="panel">
          <h2>Contracts</h2>
          {Object.entries(CONTRACTS).map(([name, address]) => (
            <div className="kv" key={name}>
              <span>{name}</span>
              <code>{address}</code>
            </div>
          ))}
        </div>
        <div className="panel full">
          <h2>Runtime checklist</h2>
          <div className="feature-page-grid">
            <div className="app-feature-card"><span><BadgeCheck /></span><h2>Frontend</h2><p>Vercel serves the Somnia-specific landing, auth, and dashboard routes.</p></div>
            <div className="app-feature-card"><span><BadgeCheck /></span><h2>Contracts</h2><p>Every core module has a known deployed address and explorer path.</p></div>
            <div className="app-feature-card"><span><BadgeCheck /></span><h2>Records</h2><p>Actions write browser/Supabase-compatible records for audit and demo review.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
