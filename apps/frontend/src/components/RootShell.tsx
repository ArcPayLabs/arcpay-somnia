"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

const publicPrefixes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/solutions",
  "/security",
  "/pricing",
  "/docs",
  "/onboard",
];

export function RootShell({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const publicPage = pathname === "/" || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
  return publicPage ? <>{children}</> : <AppShell>{children}</AppShell>;
}
