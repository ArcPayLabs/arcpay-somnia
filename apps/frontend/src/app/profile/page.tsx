"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Mail, UserRound, Wallet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { connectedAddress, shortAddress } from "@/lib/somnia";

export default function ProfilePage() {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState("ArcPay Somnia workspace");
  const [status, setStatus] = useState("Profile changes are local until you attach a signed update flow.");

  useEffect(() => {
    connectedAddress().then(setAddress).catch(() => undefined);
    const session = window.localStorage.getItem("arcpay-somnia-email-session");
    if (session) {
      try {
        const parsed = JSON.parse(session) as { user?: { email?: string } };
        setEmail(parsed.user?.email ?? "");
      } catch {}
    }
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Workspace profile"
        title="Operator identity"
        description="Somnia wallet identity is the primary account layer. Email can be linked as a secondary login path, while agent actions stay wallet-signed."
        badges={["Wallet-first", "Email optional", "Workspace metadata"]}
      />
      <section className="profile-layout section">
        <div className="profile-card large">
          <div className="profile-avatar"><UserRound size={34} /></div>
          <span>Operator</span>
          <h2>{workspace}</h2>
          <p>{address ? `Primary wallet: ${shortAddress(address)}` : "Connect a Somnia wallet to bind this browser session to an operator identity."}</p>
          <div className="profile-meta">
            <div><Wallet /><span>{address || "No wallet linked"}</span></div>
            <div><Mail /><span>{email || "Email not linked"}</span></div>
          </div>
        </div>
        <form className="profile-card" onSubmit={(event) => { event.preventDefault(); setStatus("Profile saved locally for this browser session."); }}>
          <h2>Workspace details</h2>
          <label className="field"><span>Workspace name</span><input value={workspace} onChange={(event) => setWorkspace(event.target.value)} /></label>
          <label className="field"><span>Notification email</span><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="operator@studio.com" /></label>
          <button type="submit">Save profile</button>
          <div className="notice">{status}</div>
        </form>
        <div className="profile-card"><Building2 /><h2>Cross-chain records</h2><p>Somnia writes to `arcpay_somnia_records`; Sui, Mantle, and Arbitrum use their own tables in the same Supabase project.</p></div>
        <div className="profile-card"><BadgeCheck /><h2>Judge clarity</h2><p>Profile state is intentionally transparent: wallet ownership, table isolation, and audit persistence are easy to verify.</p></div>
      </section>
    </>
  );
}
