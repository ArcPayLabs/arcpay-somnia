import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname, "../../"),
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Link", value: "</.well-known/api-catalog>; rel=\"api-catalog\", </openapi.json>; rel=\"service-desc\", </docs/overview>; rel=\"service-doc\", </.well-known/mcp/server-card.json>; rel=\"mcp-server-card\", </.well-known/agent-skills/index.json>; rel=\"agent-skills\"" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://csi-58c5959c.mintlify.dev/docs",
      },
      {
        source: "/docs/:path*",
        destination: "https://csi-58c5959c.mintlify.dev/docs/:path*",
      },
    ];
  },
};

export default nextConfig;
