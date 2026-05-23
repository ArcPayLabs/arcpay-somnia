import type { Metadata } from "next";
import { RootShell } from "@/components/RootShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcPay Somnia",
  description: "Private treasury OS for autonomous agents on Somnia testnet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
