import { NextResponse } from "next/server";

const platformContract = "0x037Bb9C718F3f7fe5eCBDB0b600D607b52706776";
const agentRegistry = "0x08D1Fc808f1983d2Ea7B63a28ECD4d8C885Cd02A";

const agents = [
  {
    name: "LLM Parse Website",
    id: "12875401142070969085",
    methods: 2,
    cost: "0.10 STT/SOMI per validator",
    role: "Parse HTML websites into structured data with inspectable receipts.",
  },
  {
    name: "LLM Inference",
    id: "12847293847561029384",
    methods: 4,
    cost: "variable",
    role: "Run receipt-backed text inference for agent reasoning and summaries.",
  },
  {
    name: "JSON API Request",
    id: "13174292974160097713",
    methods: 6,
    cost: "variable",
    role: "Fetch public JSON APIs and extract selector-path values for oracle-style evidence.",
  },
];

export function GET() {
  return NextResponse.json({
    status: "configured",
    network: {
      name: "Somnia Testnet",
      chainId: 50312,
      agentsUrl: "https://agents.testnet.somnia.network",
      docsUrl: "https://docs.somnia.network/agents",
    },
    contracts: {
      platformContract,
      agentRegistry,
    },
    agents,
    receiptPolicy: {
      requiredForSettlement: true,
      requiredEvidence: [
        "Somnia Agent request details",
        "website/API fetch details when used",
        "conversion or selector steps",
        "LLM extraction or inference output",
        "final output receipt",
        "ArcPay order or audit record ID",
      ],
      arcpayRule: "ArcPay does not mark agent work complete from a Somnia Agent call unless a receipt is attached to the order, invoice, privacy intent, or audit record.",
    },
  });
}
