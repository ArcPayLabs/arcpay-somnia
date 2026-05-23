import Link from "next/link";
import type { ReactNode } from "react";
import { LogoIcon } from "./LogoIcon";

export function AuthShell({
  heading,
  subheading,
  children,
}: {
  readonly heading: string;
  readonly subheading: string;
  readonly children: ReactNode;
}) {
  return (
    <main className="auth-page">
      <aside className="auth-visual">
        <video className="auth-video" autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>
        <div className="auth-copy">
          <Link className="auth-logo" href="/">
            <LogoIcon />
            <span>ArcPay</span>
          </Link>
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </div>
      </aside>
      <section className="auth-panel">
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}
