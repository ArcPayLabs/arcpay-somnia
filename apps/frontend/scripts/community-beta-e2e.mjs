import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { chromium, expect } from "@playwright/test";

const port = 3217;
const baseUrl = `http://127.0.0.1:${port}`;
const frontendDir = fileURLToPath(new URL("..", import.meta.url));
const wallet = "0xB883e76A4f6841E72cAF1C28ba00f78df974f448";
const now = new Date().toISOString();
const records = [
  {
    id: "agent-market-data",
    type: "agent",
    title: "Registered Market Data Agent",
    status: "confirmed",
    txHash: "0x1111111111111111111111111111111111111111111111111111111111111111",
    createdAt: now,
  },
  {
    id: "x402-market-data",
    type: "x402",
    title: "Paid x402 order for market-data-agent",
    status: "paid",
    txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
    createdAt: now,
  },
  {
    id: "card-market-data",
    type: "card",
    title: "Created Market Data Agent Card",
    status: "created",
    txHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
    createdAt: now,
  },
  {
    id: "privacy-market-data",
    type: "privacy",
    title: "Created STT privacy commitment",
    status: "submitted",
    txHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
    createdAt: now,
  },
  {
    id: "swap-market-data",
    type: "swap",
    title: "Completed STT to SOMUSD swap",
    status: "confirmed",
    txHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
    createdAt: now,
  },
];

const serverCommand = process.platform === "win32" ? "cmd.exe" : "npm";
const serverArgs = process.platform === "win32"
  ? ["/d", "/s", "/c", "npm", "run", "dev", "--", "--port", String(port), "--hostname", "127.0.0.1"]
  : ["run", "dev", "--", "--port", String(port), "--hostname", "127.0.0.1"];
const server = spawn(serverCommand, serverArgs, {
  cwd: frontendDir,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  shell: false,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk.toString();
});

try {
  await waitForServer();
  console.log("server ready");
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(({ records: seededRecords, wallet: seededWallet }) => {
    window.localStorage.setItem("arcpay-somnia-wallet-session", seededWallet);
    window.localStorage.setItem("arcpay-somnia-wallet-name", "E2E Wallet");
    window.localStorage.setItem("arcpay-somnia-community-mode", "on");
    window.localStorage.setItem("arcpay-somnia-records", JSON.stringify(seededRecords));
  }, { records, wallet });
  const page = await context.newPage();
  page.setDefaultTimeout(90_000);
  page.setDefaultNavigationTimeout(90_000);

  console.log("checking quests");
  await page.goto(`${baseUrl}/quests`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Quests" })).toBeVisible();
  await expect(page.getByText("1250").first()).toBeVisible();
  await expect(page.getByText("Connected wallet 0xB883...f448.")).toBeVisible();
  await expect(page.getByText("Registered Market Data Agent - tx 0x1111...1111")).toBeVisible();
  await expect(page.getByText("Paid x402 order for market-data-agent - tx 0x2222...2222")).toBeVisible();
  await expect(page.getByText("Created Market Data Agent Card - tx 0x3333...3333")).toBeVisible();
  await expect(page.getByText("Created STT privacy commitment - tx 0x4444...4444")).toBeVisible();
  await expect(page.getByText("Completed STT to SOMUSD swap - tx 0x5555...5555")).toBeVisible();
  await expect(page.getByText("Done")).toHaveCount(6);

  console.log("checking leaderboard");
  await page.goto(`${baseUrl}/leaderboard`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Leaderboard" })).toBeVisible();
  await expect(page.getByText("1250").first()).toBeVisible();
  await expect(page.getByText("Market Data Agent", { exact: true })).toBeVisible();
  await expect(page.getByText("Paid x402 order for market-data-agen")).toBeVisible();
  await expect(page.getByText("Created STT privacy commitment")).toBeVisible();

  console.log("checking agent template handoff");
  await page.goto(`${baseUrl}/agents?template=market-data-agent`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Agents" })).toBeVisible();
  await expect(page.getByText("Market Data Agent", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Service slug")).toHaveValue("market-data-agent");
  await expect(page.getByLabel("HTTPS endpoint")).toHaveValue("https://example.com/somnia-agent/market-data");
  await expect(page.getByText("Register service agent").last()).toBeVisible();

  await browser.close();
  console.log("community beta e2e passed");
} finally {
  stopServer();
}

async function waitForServer() {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // Server not ready yet.
    }
    await delay(750);
  }
  throw new Error(`Next dev server did not start.\n${serverLog}`);
}

function stopServer() {
  if (!server.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}
