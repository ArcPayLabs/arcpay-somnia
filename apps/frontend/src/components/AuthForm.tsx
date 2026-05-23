"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { signerProvider, switchToSomnia } from "@/lib/somnia";

function supabaseAuthHeaders() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Supabase anon key is not configured.");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function supabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Supabase URL is not configured.");
  return url;
}

async function walletSignIn() {
  await switchToSomnia();
  const signer = await signerProvider();
  const address = await signer.getAddress();
  const challenge = await fetch("/api/auth/challenge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  }).then((response) => response.json());
  const signature = await signer.signMessage(challenge.message);
  const verified = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signature }),
  });
  if (!verified.ok) throw new Error("Wallet signature verification failed.");
}

export function WalletAuthButton({ label = "Connect Somnia wallet" }: { readonly label?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    setStatus("loading");
    setMessage("");
    try {
      await walletSignIn();
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Wallet sign-in failed.");
    }
  }

  return (
    <div className="auth-wallet">
      <button disabled={status === "loading"} onClick={() => void submit()} type="button">
        <span />
        {status === "loading" ? "Verifying wallet..." : label}
      </button>
      {message ? <p className="form-error">{message}</p> : null}
    </div>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`${supabaseUrl()}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: supabaseAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error_description ?? payload.msg ?? "Email sign-in failed.");
      window.localStorage.setItem("arcpay-somnia-email-session", JSON.stringify(payload));
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Email sign-in failed.");
    }
  }

  return (
    <>
      <div>
        <h1>Sign in</h1>
        <p>Use wallet first, or use email only if that account already exists.</p>
      </div>
      <WalletAuthButton />
      <div className="auth-divider"><span>Or with email</span></div>
      <form className="auth-form" onSubmit={submit}>
        <label><span>Work email</span><input required type="email" placeholder="ada@studio.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>
          <span>Password</span>
          <div className="password-box">
            <input required type={show ? "text" : "password"} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" onClick={() => setShow((value) => !value)}>{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </label>
        <Link className="forgot-link" href="/forgot-password">Forgot password?</Link>
        {message ? <p className="form-error">{message}</p> : null}
        <button disabled={status === "loading"} type="submit">{status === "loading" ? "Signing in..." : "Sign in"}</button>
      </form>
      <p className="auth-switch">New to ArcPay? <Link href="/sign-up">Create a workspace</Link></p>
    </>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", workspace: "", email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`${supabaseUrl()}/auth/v1/signup`, {
        method: "POST",
        headers: supabaseAuthHeaders(),
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            workspace: form.workspace,
            chain: "somnia-testnet",
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error_description ?? payload.msg ?? "Workspace creation failed.");
      setStatus("saved");
      setMessage("Workspace created. Check your email if confirmation is enabled.");
      if (payload.access_token) {
        window.localStorage.setItem("arcpay-somnia-email-session", JSON.stringify(payload));
        router.replace("/dashboard");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Workspace creation failed.");
    }
  }

  return (
    <>
      <div>
        <h1>Create your workspace</h1>
        <p>Wallet sign-in can create the account automatically. Use email when you want a second login path.</p>
      </div>
      <WalletAuthButton label="Create with Somnia wallet" />
      <div className="auth-divider"><span>Or with email</span></div>
      <form className="auth-form" onSubmit={submit}>
        <div className="two-fields">
          <label><span>First name</span><input required placeholder="Ada" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label>
          <label><span>Last name</span><input required placeholder="Lovelace" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label>
        </div>
        <label><span>Workspace name</span><input required placeholder="Multi-agent agency" value={form.workspace} onChange={(event) => setForm({ ...form, workspace: event.target.value })} /></label>
        <label><span>Work email</span><input required type="email" placeholder="ada@studio.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label><span>Password</span><input required minLength={8} type="password" placeholder="At least 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        {message ? <p className={status === "error" ? "form-error" : "form-success"}>{message}</p> : null}
        <button disabled={status === "loading"} type="submit">{status === "loading" ? "Creating..." : "Create workspace"}</button>
      </form>
      <p className="auth-switch">Already on ArcPay? <Link href="/sign-in">Sign in</Link></p>
    </>
  );
}
