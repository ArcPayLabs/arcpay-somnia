import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname, "../../"),
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "https://csi-58c5959c.mintlify.app/overview",
        permanent: false,
      },
      {
        source: "/docs/:path*",
        destination: "https://csi-58c5959c.mintlify.app/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
