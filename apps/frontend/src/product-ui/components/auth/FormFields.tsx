import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { CheckCircle2, Eye, EyeOff, Wallet, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ensureCurrentUserAccount } from "@/lib/account";
import { getOptionalSupabaseClient } from "../../../app/supabase-client";
import { useWalletConnectAction } from "@/hooks/use-wallet-connect-action";

export function Field({
  label,
  hint,
  ...rest
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full bg-muted border border-transparent rounded-xl h-11 px-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function PasswordField({
  label = "Password",
  hint,
  ...rest
}: ComponentProps<"input"> & { label?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="relative mt-1.5">
        <input
          {...rest}
          type={show ? "text" : "password"}
          placeholder="********"
          className="w-full bg-muted border border-transparent rounded-xl h-11 px-4 pr-11 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle password visibility"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function WalletConnectButton({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const wallet = useWalletConnectAction();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const label = useMemo(() => {
    if (loading || wallet.connecting) return "Verifying wallet...";
    return wallet.connected && wallet.publicKeyBase58 ? wallet.label : "Connect Somnia wallet";
  }, [loading, wallet.connected, wallet.connecting, wallet.label, wallet.publicKeyBase58]);

  async function connectAndSignIn(walletId?: string) {
    const supabase = getOptionalSupabaseClient();
    if (!supabase) {
      setErrorMessage("Supabase auth is not configured for this frontend runtime.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await wallet.connectWallet(walletId);
      if (result.supabaseAuth) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: result.supabaseAuth.tokenHash,
          type: result.supabaseAuth.type,
        });
        if (error) throw error;
      }

      window.dispatchEvent(new StorageEvent("storage", { key: "arcpay-somnia-wallet-session" }));

      await ensureCurrentUserAccount(supabase);

      if (redirectTo) {
        router.replace(redirectTo);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : wallet.errorMessage ?? "Wallet sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        disabled={loading}
        className="w-full h-12 bg-foreground text-background rounded-xl flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        <span className="w-2 h-2 rounded-full bg-primary" />
        {label}
      </button>
      {errorMessage && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMessage}
        </div>
      )}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-border bg-background p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Somnia wallet</div>
                <h3 className="mt-1 text-2xl font-semibold">Choose a wallet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  ArcPay will add or switch to Somnia Testnet, then ask you to sign a login challenge.
                </p>
              </div>
              <button type="button" onClick={() => setPickerOpen(false)} className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {wallet.availableWallets.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  disabled={!option.installed || loading || wallet.connecting}
                  onClick={() => void connectAndSignIn(option.id).then(() => setPickerOpen(false))}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="rounded-2xl bg-primary/10 p-3 text-primary"><Wallet className="h-5 w-5" /></span>
                    <span>
                      <span className="block text-sm font-semibold">{option.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </span>
                  {option.installed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <span className="text-xs font-semibold text-muted-foreground">Not detected</span>}
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
              If Somnia Testnet is missing, approve the wallet network prompt. Chain ID: 50312. RPC: dream-rpc.somnia.network.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Divider({ label = "Or with email" }: { label?: string }) {
  return (
    <div className="relative my-2">
      <div className="border-t border-border" />
      <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}
