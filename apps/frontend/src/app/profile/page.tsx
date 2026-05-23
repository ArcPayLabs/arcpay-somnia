import { BadgeCheck, Building2, Mail, Wallet } from "lucide-react";
import { AppPage } from "@/components/AppPage";

export default function ProfilePage() {
  return (
    <AppPage
      eyebrow="Workspace profile"
      title="Operator identity"
      description="Somnia wallet identity is the primary account layer. Email can be linked as a secondary login path, while agent actions stay wallet-signed."
      badges={["Wallet-first", "Email optional", "Workspace metadata"]}
      cards={[
        { title: "Wallet login", body: "Signing a Somnia wallet challenge creates or resumes the operator workspace without requiring email first.", icon: Wallet },
        { title: "Workspace metadata", body: "Use Supabase records for audit, invoices, contractors, and cross-chain table separation across ArcPay repos.", icon: Building2 },
        { title: "Email recovery", body: "Email login remains available for users who explicitly create an email account or add one later.", icon: Mail },
        { title: "Submission proof", body: "Profile state is kept simple for judges: wallet ownership, network isolation, and audit persistence are the proof points.", icon: BadgeCheck },
      ]}
    />
  );
}
