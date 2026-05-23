import { PageHeader } from "@/components/PageHeader";
import { CONTRACTS, SOMNIA_EXPLORER_URL, addressUrl } from "@/lib/somnia";

export default function ProofsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Judge proof pack"
        title="Somnia deployment proof"
        description="Everything needed to verify the build: deployed contracts, explorer links, local commands, and the exact product surface built for Somnia testnet."
        badges={["Open source", "Runnable locally", "Deployed on testnet"]}
      />
      <section className="grid section">
        <div className="panel">
          <h2>Contract addresses</h2>
          {Object.entries(CONTRACTS).map(([name, address]) => (
            <div className="kv" key={name}>
              <span>{name}</span>
              <a href={addressUrl(address)} target="_blank" rel="noreferrer">{address}</a>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Run locally</h2>
          <code>npm install</code>
          <code>npm test</code>
          <code>npm run build</code>
          <code>npm run build:frontend</code>
          <code>npm run dev:frontend</code>
          <code>npm run arcpay -- privacy-guide</code>
        </div>
        <div className="panel full">
          <h2>Explorer</h2>
          <p>
            Somnia Testnet explorer:{" "}
            <a href={SOMNIA_EXPLORER_URL} target="_blank" rel="noreferrer">{SOMNIA_EXPLORER_URL}</a>
          </p>
          <p>
            The core live flow is: register agent, set spend policy, allow agent, create escrowed order, update order status,
            settle or refund, then review the audit trail.
          </p>
          <p>
            Builders can integrate the privacy layer from <code>docs/privacy-intents.md</code> or use the CLI/MCP helpers
            to derive commitments and nullifiers for SOMUSD/STT payment intents.
          </p>
        </div>
      </section>
    </>
  );
}
