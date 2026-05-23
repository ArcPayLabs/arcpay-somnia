import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export default function ResetPasswordPage() {
  return (
    <AuthShell heading="Reset password." subheading="Use the recovery link from Supabase, then return to ArcPay Somnia.">
      <div><h1>Reset password</h1><p>Password reset is handled by your Supabase recovery session.</p></div>
      <Link className="auth-big-link" href="/sign-in">Return to sign in</Link>
    </AuthShell>
  );
}
