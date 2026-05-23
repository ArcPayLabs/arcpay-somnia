"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("If this email exists, Supabase will send a recovery link.");
  }

  return (
    <AuthShell heading="Recover access." subheading="Reset email login while wallet auth remains available for Somnia operators.">
      <div><h1>Forgot password</h1><p>Enter your email to request a recovery link.</p></div>
      <form className="auth-form" onSubmit={submit}>
        <label><span>Work email</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        {message ? <p className="form-success">{message}</p> : null}
        <button type="submit">Send recovery link</button>
      </form>
      <p className="auth-switch"><Link href="/sign-in">Back to sign in</Link></p>
    </AuthShell>
  );
}
