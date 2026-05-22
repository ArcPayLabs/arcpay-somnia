import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(appDir, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
