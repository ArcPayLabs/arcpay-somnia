import { shortAddress, type LocalRecord } from "@somnia/lib/somnia";

export type QuestRule = {
  id: "wallet" | "agent" | "x402" | "card" | "privacy" | "trading";
  title: string;
  body: string;
  points: number;
  href: string;
  types: string[];
};

export type QuestProgress = {
  completed: Set<QuestRule["id"]>;
  points: number;
};

export type LeaderboardBoard = {
  title: string;
  rows: Array<{ name: string; score: string; hint?: string }>;
};

export const QUEST_RULES: QuestRule[] = [
  { id: "wallet", title: "Enter Somnia beta", body: "Connect your wallet and create an ArcPay workspace.", points: 50, href: "/wallet", types: [] },
  { id: "agent", title: "Launch your first agent", body: "Pick a template, add an endpoint, and publish your agent profile.", points: 250, href: "/launch-agent", types: ["agent"] },
  { id: "x402", title: "Get paid for work", body: "Create an x402 paid task and save the order proof.", points: 300, href: "/x402", types: ["x402", "order"] },
  { id: "card", title: "Issue an agent card", body: "Create a SOMUSD budget card for a controlled agent spend flow.", points: 200, href: "/cards", types: ["card"] },
  { id: "privacy", title: "Add private proof", body: "Create a privacy intent with encrypted memo details.", points: 200, href: "/privacy", types: ["privacy", "viewing-key"] },
  { id: "trading", title: "Complete a trading proof", body: "Run a swap or yield proof and keep the tx evidence.", points: 250, href: "/swaps", types: ["swap", "yield"] },
];

export function questProgress(records: LocalRecord[], wallet: string): QuestProgress {
  const completed = new Set<QuestRule["id"]>();
  if (wallet) completed.add("wallet");
  for (const quest of QUEST_RULES) {
    if (quest.types.some((type) => hasRecordType(records, type))) completed.add(quest.id);
  }
  return {
    completed,
    points: QUEST_RULES.reduce((sum, quest) => sum + (completed.has(quest.id) ? quest.points : 0), 0),
  };
}

export function questEvidence(quest: QuestRule, records: LocalRecord[], wallet: string) {
  if (quest.id === "wallet") return wallet ? `Connected wallet ${shortAddress(wallet)}.` : "Wallet not connected.";
  const record = records.find((item) => quest.types.includes(item.type.toLowerCase()));
  if (!record) return "Waiting for evidence.";
  return `${record.title}${record.txHash ? ` - tx ${shortAddress(record.txHash)}` : ""}`;
}

export function buildCommunityLeaderboard(records: LocalRecord[], wallet: string): LeaderboardBoard[] {
  return [
    {
      title: "Top Operators",
      rows: [{ name: wallet ? shortAddress(wallet) : "Connect wallet", score: String(scoreRecords(records, wallet)), hint: `${records.length} workspace records` }],
    },
    { title: "Top Agents", rows: rowsForType(records, ["agent"], "No agents yet") },
    { title: "x402 Builders", rows: rowsForType(records, ["x402", "order"], "No paid work yet") },
    { title: "Proof Makers", rows: rowsForType(records, ["privacy", "card", "swap", "yield", "oracle", "reputation"], "No proof records yet") },
  ];
}

export function scoreRecords(records: LocalRecord[], wallet: string) {
  let score = wallet ? 50 : 0;
  for (const record of records) {
    const type = record.type.toLowerCase();
    if (type === "agent") score += 250;
    else if (type === "x402" || type === "order") score += 300;
    else if (type === "card") score += 200;
    else if (type === "privacy" || type === "viewing-key") score += 200;
    else if (type === "swap" || type === "yield") score += 250;
    else score += 25;
  }
  return score;
}

function rowsForType(records: LocalRecord[], types: string[], empty: string) {
  const rows = records
    .filter((record) => types.includes(record.type.toLowerCase()))
    .slice(0, 3)
    .map((record) => ({
      name: record.title.replace(/^Registered\s+/i, "").slice(0, 36),
      score: record.txHash ? "verified" : record.status,
      hint: record.txHash ? shortAddress(record.txHash) : record.type,
    }));
  return rows.length ? rows : [{ name: empty, score: "0", hint: "Complete quests to appear here" }];
}

function hasRecordType(records: LocalRecord[], type: string) {
  return records.some((record) => record.type.toLowerCase() === type);
}
