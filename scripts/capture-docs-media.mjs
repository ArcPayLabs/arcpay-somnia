#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(new URL("../apps/frontend/package.json", import.meta.url));
const { chromium } = require("playwright");

const baseUrl = (process.env.ARCPAY_DOCS_CAPTURE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");
const outDir = path.resolve("mintlify", "images");

const shots = [
  { name: "landing", path: "/" },
  { name: "docs", path: "/docs" },
  { name: "x402", path: "/app/x402" },
  { name: "privacy", path: "/app/privacy" },
  { name: "invoices", path: "/app/invoices" },
  { name: "audit", path: "/app/audit" },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

for (const shot of shots) {
  const url = `${baseUrl}${shot.path}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.screenshot({ path: path.join(outDir, `${shot.name}.png`), fullPage: true });
  console.log(`captured ${shot.name}: ${url}`);
}

await browser.close();
