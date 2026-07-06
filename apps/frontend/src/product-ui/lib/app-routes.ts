export const COMMUNITY_ROUTES = new Set([
  "/dashboard",
  "/launch-agent",
  "/quests",
  "/leaderboard",
  "/wallet",
  "/agents",
  "/x402",
  "/cards",
  "/swaps",
  "/yield",
  "/privacy",
  "/settings",
]);

export function isCommunityRoute(pathname: string) {
  return COMMUNITY_ROUTES.has(pathname) || Array.from(COMMUNITY_ROUTES).some((route) => pathname.startsWith(`${route}/`));
}
