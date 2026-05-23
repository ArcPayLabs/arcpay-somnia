import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Spin up your workspace."
      subheading="Three steps to a treasury that can coordinate autonomous agents on Somnia."
    >
      <SignUpForm />
    </AuthShell>
  );
}
