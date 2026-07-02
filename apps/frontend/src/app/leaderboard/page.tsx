"use client";

import { ProductAppShell, renderProductRoute } from "../product-render";
import { Route } from "../../product-ui/routes/app.leaderboard";

export default function LeaderboardPage() {
  return <ProductAppShell>{renderProductRoute(Route)}</ProductAppShell>;
}
