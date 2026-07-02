"use client";

import { ProductAppShell, renderProductRoute } from "../product-render";
import { Route } from "../../product-ui/routes/app.quests";

export default function QuestsPage() {
  return <ProductAppShell>{renderProductRoute(Route)}</ProductAppShell>;
}
