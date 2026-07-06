// @ts-nocheck
"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Divider, WalletConnectButton } from "@/components/auth/FormFields";
import { useAppAccess } from "@/hooks/use-app-access";

export const Route = createFileRoute("/onboard")({
  head: () => ({
    meta: [
      { title: "Onboard - ArcPay" },
      { name: "description", content: "Create or enter your ArcPay workspace with wallet or email." },
    ],
  }),
  component: Onboard,
});

function Onboard() {
  const access = useAppAccess();

  return (
    <AuthShell
      heading="Create your agent workspace."
      subheading="Start with a wallet, create a workspace, then launch an agent with a budget, card, policy, and proof trail on Somnia."
      steps={[
        { n: 1, t: "Enter beta" },
        { n: 2, t: "Create workspace" },
        { n: 3, t: "Launch agent" },
      ]}
      activeStep={1}
    >
      <div>
        <h1 className="text-3xl font-medium tracking-tight" style={{ letterSpacing: "-0.03em" }}>
          Start with wallet or beta email
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Wallet sign-in creates or resumes one ArcPay account per wallet. If you do not have access yet, join the beta wave so we can approve your wallet or email.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/35 p-4">
        <div className="text-sm font-semibold">No invite yet?</div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Join the community beta, tell us what kind of agent you want to launch, and get approved in the next wave.
        </p>
        <Link
          to="/beta"
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-semibold text-background hover:brightness-110"
        >
          Join beta wave <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <WalletConnectButton redirectTo="/dashboard" />

      {access.signedIn && (
        <Link
          to="/dashboard"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground hover:brightness-110"
        >
          Continue to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      <Divider label="Or use email" />

      <div className="grid gap-3">
        <Link
          to="/sign-up"
          className="flex h-12 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground hover:brightness-110"
        >
          Create workspace with email
        </Link>
        <Link
          to="/sign-in"
          className="flex h-12 items-center justify-center rounded-xl border border-border bg-background font-semibold text-foreground hover:bg-muted"
        >
          Sign in to existing workspace
        </Link>
      </div>
    </AuthShell>
  );
}
