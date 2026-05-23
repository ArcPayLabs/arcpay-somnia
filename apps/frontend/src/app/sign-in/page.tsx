import { AuthShell } from "@/components/AuthShell";
import { SignInForm } from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <AuthShell
      heading="Welcome back."
      subheading="Wallet sign-in resumes your Somnia operator session. Email sign-in is available only after an email account exists."
    >
      <SignInForm />
    </AuthShell>
  );
}
