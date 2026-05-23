"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoIcon } from "./LogoIcon";

const links = [
  ["Product", "/"],
  ["Solutions", "/solutions"],
  ["Security", "/security"],
  ["Pricing", "/pricing"],
  ["Docs", "/docs"],
] as const;

export function MarketingNav({ tone = "light" }: { readonly tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const dark = tone === "dark";
  return (
    <nav className={`marketing-nav ${dark ? "dark" : ""}`}>
      <Link className="marketing-brand" href="/">
        <LogoIcon />
        <span>ArcPay</span>
      </Link>
      <div className="marketing-links">
        {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </div>
      <div className="marketing-actions">
        <Link href="/sign-in">Sign in</Link>
        <Link className="open-app" href="/dashboard">Open App</Link>
      </div>
      <button className="menu-button" onClick={() => setOpen((value) => !value)} type="button" aria-label="Menu">
        {open ? <X /> : <Menu />}
      </button>
      {open ? (
        <div className="mobile-menu">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/sign-in">Sign in</Link>
          <Link className="open-app" href="/dashboard">Open App</Link>
        </div>
      ) : null}
    </nav>
  );
}
