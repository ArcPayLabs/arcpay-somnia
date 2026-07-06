"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CheckCircle2, RadioTower, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export const Route = createFileRoute("/beta")({
  head: () => ({
    meta: [
      { title: "ArcPay Somnia Beta" },
      { name: "description", content: "Join the ArcPay Somnia community beta to launch agents, earn points, and test agent payments." },
    ],
  }),
  component: BetaPage,
});

type SubmitState = "idle" | "loading" | "success" | "error";

function BetaPage() {
  const [form, setForm] = useState({
    email: "",
    telegram: "",
    walletAddress: "",
    inviteCode: "",
    wave: "wave-1",
  });
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("https://t.me/TheLuckyReborned");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok && response.status !== 202) throw new Error(body?.error ?? "Beta request failed.");
      setState("success");
      setMessage(body.message ?? "Beta request received.");
      if (body.telegramUrl) setTelegramUrl(body.telegramUrl);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <MarketingShell navTone="light">
      <div className="px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-[88rem] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="relative overflow-hidden rounded-[2.25rem] border border-border bg-[radial-gradient(circle_at_12%_14%,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_90%_18%,rgba(56,189,248,0.16),transparent_30%),linear-gradient(135deg,#ffffff_0%,#f6f8fb_52%,#eef7ff_100%)] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)] md:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 rounded-full border-[48px] border-sky-100/80 sm:block" />
            <div className="pointer-events-none absolute bottom-0 right-0 hidden h-44 w-44 rounded-tl-[5rem] bg-white/55 sm:block" />
            <div className="relative">
            <div className="inline-flex rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
              Somnia community beta
            </div>
            <h1 className="mt-8 max-w-2xl text-5xl font-medium leading-[0.95] tracking-[-0.05em] text-foreground md:text-7xl">
              Launch your first agent on Somnia.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              Create an agent workspace, set a budget, get paid for agent work, and collect proof. ArcPay makes Somnia agent finance simple enough for users and powerful enough for builders.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Pill icon={Bot} title="Create an agent" body="Pick a template, add an endpoint, and launch a paid service profile." />
              <Pill icon={RadioTower} title="Get paid" body="Use x402-style tasks so agents and users can pay for work." />
              <Pill icon={ShieldCheck} title="Set a budget" body="Limit what each agent can spend before transactions happen." />
              <Pill icon={Users} title="Earn points" body="Complete missions, collect proof, and climb the beta leaderboard." />
            </div>
            <div className="mt-8 grid gap-3 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur sm:grid-cols-3">
              <Proof label="Network" value="Somnia Testnet" />
              <Proof label="Wave" value="First 50 invites" />
              <Proof label="Beta loop" value="Create, earn, share" />
            </div>
            <div className="mt-4 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Trophy className="h-4 w-4 text-primary" /> Wave 1 access
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Join the waitlist now. We release invite codes in waves so early users get support, points, and leaderboard visibility.
                  </p>
                </div>
                <div className="hidden rounded-2xl bg-foreground px-4 py-3 text-center text-background sm:block">
                  <div className="text-2xl font-semibold">50</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">wave one</div>
                </div>
              </div>
            </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Join the beta</div>
              <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em]">Join the Wave 1 waitlist.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Drop your email, Telegram, and Somnia wallet. We approve wallets in waves, send invite codes through Telegram, and help the first testers launch agents without overwhelming the beta.
              </p>
            </div>
            <div className="mb-6 grid gap-2 rounded-3xl border border-border bg-muted/35 p-3 text-sm sm:grid-cols-3">
              <MiniStep icon={Sparkles} label="Apply" />
              <MiniStep icon={CheckCircle2} label="Get invite" />
              <MiniStep icon={Trophy} label="Earn points" />
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Email" type="email" placeholder="you@domain.com" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
                <Field label="Somnia wallet" placeholder="0x..." value={form.walletAddress} onChange={(value) => setForm({ ...form, walletAddress: value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Telegram" placeholder="@handle" value={form.telegram} onChange={(value) => setForm({ ...form, telegram: value })} required />
                <Field label="Invite code" placeholder="Optional: ARCPAY-WAVE1-..." value={form.inviteCode} onChange={(value) => setForm({ ...form, inviteCode: value })} />
              </div>
              <input type="hidden" value={form.wave} readOnly />
              <div className="rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm leading-6 text-muted-foreground">
                After approval, we add your wallet to the beta access list and send your invite code on Telegram from @TheLuckyReborned. First testers get quests, leaderboard points, and direct support.
              </div>

              {message ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${state === "error" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                  {message}
                </div>
              ) : null}

              <button disabled={state === "loading"} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:brightness-105 disabled:opacity-60">
                {state === "loading" ? "Submitting..." : "Request beta access"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {state === "success" ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={telegramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background">
                  Join Telegram <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/onboard" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
                  Open app <CheckCircle2 className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </MarketingShell>
  );
}

function Pill({ icon: Icon, title, body }: { icon: typeof Bot; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/65 p-4 shadow-sm backdrop-blur">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm leading-6 text-muted-foreground">{body}</div>
    </div>
  );
}

function Proof({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function MiniStep({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-background px-3 py-2 font-medium">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}
