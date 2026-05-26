import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname, "../../"),
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://csi-58c5959c.mintlify.app/overview",
      },
      {
        source: "/docs/:path*",
        destination: "https://csi-58c5959c.mintlify.app/:path*",
      },
    ];
  },
};

export default nextConfig;
