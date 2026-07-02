"use client";

import { ProductAppShell, renderProductRoute } from "../product-render";
import { Route } from "../../product-ui/routes/app.launch-agent";

export default function LaunchAgentPage() {
  return <ProductAppShell>{renderProductRoute(Route)}</ProductAppShell>;
}
