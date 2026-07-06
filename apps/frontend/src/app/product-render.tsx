"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopBar } from "@/components/app/AppTopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppAccess } from "@/hooks/use-app-access";
import { useAdminAccess } from "@/hooks/use-admin-access";
import { isCommunityRoute } from "@/lib/app-routes";

type ProductRoute = {
  readonly options?: {
    readonly component?: () => ReactNode;
  };
  readonly component?: () => ReactNode;
};

export function renderProductRoute(route: ProductRoute): ReactNode {
  const Component = route.options?.component ?? route.component;

  if (!Component) {
    return null;
  }

  return <Component />;
}

export function ProductAppShell({ children }: { readonly children: ReactNode }) {
  const access = useAppAccess();
  const admin = useAdminAccess();
  const router = useRouter();
  const pathname = usePathname();
  const isFullConsoleRoute = !isCommunityRoute(pathname);

  useEffect(() => {
    if (!access.loading && !access.canOpenApp) {
      router.replace("/onboard");
    }
    if (!access.loading && access.canOpenApp && !admin.loading && !admin.admin && isFullConsoleRoute) {
      router.replace("/dashboard");
    }
  }, [access.canOpenApp, access.loading, admin.admin, admin.loading, isFullConsoleRoute, router]);

  if (!access.loading && !access.canOpenApp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <div className="text-sm font-semibold text-foreground">
            {access.hasIdentity ? "Beta approval required." : "Redirecting to onboarding..."}
          </div>
          <div className="mt-1 max-w-md text-sm text-muted-foreground">
            {access.hasIdentity
              ? "This wallet or email is not active in the ArcPay beta list yet. Apply through /beta or ask Henry to mark your request as invited or active."
              : "Connect an approved wallet or sign in with an approved email before opening ArcPay."}
          </div>
        </div>
      </div>
    );
  }

  if (isFullConsoleRoute && (access.loading || admin.loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <div className="text-sm font-semibold text-foreground">Verifying admin access...</div>
          <div className="mt-1 max-w-md text-sm text-muted-foreground">
            Full console routes stay hidden until ArcPay confirms the signed admin session.
          </div>
        </div>
      </div>
    );
  }

  if (!admin.loading && !admin.admin && isFullConsoleRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <div className="text-sm font-semibold text-foreground">Community mode only.</div>
          <div className="mt-1 max-w-md text-sm text-muted-foreground">
            This page is restricted to ArcPay admins. Community beta users can launch agents, complete quests, use wallet, x402, cards, swaps, yield, and privacy flows.
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full min-w-0 overflow-x-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-col">
          <AppTopBar />
          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
