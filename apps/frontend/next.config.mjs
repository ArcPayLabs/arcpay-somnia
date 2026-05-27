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
