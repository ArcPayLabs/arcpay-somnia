"use client";

import { useEffect } from "react";

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: () => Promise<unknown>;
};

type WebMcpNavigator = Navigator & {
  modelContext?: {
    provideContext?: (context: {
      name: string;
      description: string;
      tools: WebMcpTool[];
    }) => Promise<void> | void;
  };
};

const fetchJson = async (path: string) => {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  return response.json();
};

export function WebMcpProvider() {
  useEffect(() => {
    const modelContext = (navigator as WebMcpNavigator).modelContext;
    if (!modelContext?.provideContext) return;

    void modelContext.provideContext({
      name: "ArcPay Somnia",
      description:
        "ArcPay Somnia exposes agent treasury, x402, MCP, Somnia Agents, privacy, card, invoice, and audit tools.",
      tools: [
        {
          name: "arcpay_somnia_status",
          description: "Read live ArcPay Somnia system status.",
          inputSchema: { type: "object", properties: {} },
          execute: () => fetchJson("/api/status"),
        },
        {
          name: "arcpay_somnia_integrations",
          description: "List live Somnia integrations and adapter status.",
          inputSchema: { type: "object", properties: {} },
          execute: () => fetchJson("/api/integrations"),
        },
        {
          name: "arcpay_somnia_tools",
          description: "Read ArcPay developer tool catalog for agent clients.",
          inputSchema: { type: "object", properties: {} },
          execute: () => fetchJson("/api/developer/tools"),
        },
        {
          name: "arcpay_somnia_x402",
          description: "Read x402 payable resource discovery for ArcPay Somnia.",
          inputSchema: { type: "object", properties: {} },
          execute: () => fetchJson("/platform/v2/x402/discovery/resources"),
        },
      ],
    });
  }, []);

  return null;
}
