"use client";

import { useEffect, useState } from "react";
import { getOptionalSupabaseClient } from "../../app/supabase-client";

const walletSessionKey = "arcpay-somnia-wallet-session";
const approvedStatuses = new Set(["admin", "invited", "active"]);

export function useAppAccess() {
  const [signedIn, setSignedIn] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [approved, setApproved] = useState(false);
  const [accessStatus, setAccessStatus] = useState("checking");
  const [identity, setIdentity] = useState<{ email: string; wallet: string }>({ email: "", wallet: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const walletSession = typeof window !== "undefined" ? window.localStorage.getItem(walletSessionKey) : null;
    setWalletConnected(Boolean(walletSession));
    setIdentity((current) => ({ ...current, wallet: walletSession ?? "" }));

    async function loadSession() {
      const supabase = getOptionalSupabaseClient();
      let email = "";
      let hasSession = Boolean(walletSession);
      if (!supabase) {
        if (mounted) {
          setSignedIn(hasSession);
          await checkBetaAccess({ email, wallet: walletSession ?? "" });
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      email = data.session?.user.email ?? "";
      hasSession = Boolean(data.session?.user) || Boolean(walletSession);
      setSignedIn(hasSession);
      setIdentity({ email, wallet: walletSession ?? "" });
      await checkBetaAccess({ email, wallet: walletSession ?? "" });
    }

    async function checkBetaAccess({ email, wallet }: { email: string; wallet: string }) {
      if (!mounted) return;
      if (!email && !wallet) {
        setApproved(false);
        setAccessStatus("missing_identity");
        setLoading(false);
        return;
      }
      try {
        const params = new URLSearchParams();
        if (email) params.set("email", email);
        if (wallet) params.set("wallet", wallet);
        const response = await fetch(`/api/beta/access?${params.toString()}`, { cache: "no-store" });
        const body = await response.json().catch(() => ({})) as { approved?: boolean; status?: string };
        if (!mounted) return;
        setApproved(Boolean(body.approved));
        setAccessStatus(body.status ?? (response.ok ? "unknown" : "lookup_failed"));
      } catch {
        if (!mounted) return;
        setApproved(false);
        setAccessStatus("lookup_failed");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSession();

    const onStorage = () => {
      const nextWallet = window.localStorage.getItem(walletSessionKey);
      setWalletConnected(Boolean(nextWallet));
      setSignedIn((value) => value || Boolean(nextWallet));
      setIdentity((current) => ({ ...current, wallet: nextWallet ?? "" }));
      void checkBetaAccess({ email: identity.email, wallet: nextWallet ?? "" });
    };
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const hasIdentity = signedIn || walletConnected;
  const canOpenApp = hasIdentity && (approved || approvedStatuses.has(accessStatus));

  return {
    accessStatus,
    approved: canOpenApp,
    canOpenApp,
    hasIdentity,
    identity,
    loading,
    openAppPath: canOpenApp ? "/dashboard" : hasIdentity ? "/beta" : "/onboard",
    signedIn,
    walletConnected,
  };
}
