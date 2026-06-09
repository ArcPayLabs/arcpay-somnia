export function GET() {
  return new Response("/* handled by ArcPay app styles */", {
    headers: {
      "content-type": "text/css; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
