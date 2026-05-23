import { PageHeader } from "@/components/PageHeader";
import { CONTRACTS, SOMNIA_CHAIN_ID, SOMNIA_RPC_URL } from "@/lib/somnia";

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
        <div className="panel">
          <h2>Network</h2>
          <div className="kv"><span>Chain ID</span><strong>{SOMNIA_CHAIN_ID}</strong></div>
          <div className="kv"><span>RPC</span><code>{SOMNIA_RPC_URL}</code></div>
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
      </section>
    </>
  );
}
