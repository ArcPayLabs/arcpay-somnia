import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  Send,
  FileText,
  Users,
  ArrowLeftRight,
  TrendingUp,
  EyeOff,
  ShieldAlert,
  SlidersHorizontal,
  ScrollText,
  Settings as SettingsIcon,
  Bot,
  CreditCard,
  Gauge,
  Workflow,
  RadioTower,
  Trophy,
  Activity,
  ShieldCheck,
  Rocket,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { LogoIcon } from "@/components/brand/LogoIcon";
import { useNetwork, type NetworkMode } from "@/store/network";
import { useAdminAccess } from "@/hooks/use-admin-access";
import { COMMUNITY_ROUTES } from "@/lib/app-routes";

const ITEMS = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, networks: ["somnia"] },
  { title: "Launch Agent", url: "/launch-agent", icon: Rocket, networks: ["somnia"] },
  { title: "Quests", url: "/quests", icon: Trophy, networks: ["somnia"] },
  { title: "Leaderboard", url: "/leaderboard", icon: Activity, networks: ["somnia"] },
  { title: "Wallet", url: "/wallet", icon: Wallet, networks: ["somnia"] },
  { title: "Agents", url: "/agents", icon: Bot, networks: ["somnia"] },
  { title: "Orders", url: "/orders", icon: Workflow, networks: ["somnia"] },
  { title: "x402", url: "/x402", icon: RadioTower, networks: ["somnia"] },
  { title: "Cards", url: "/cards", icon: CreditCard, networks: ["somnia"] },
  { title: "Payments", url: "/payments", icon: Send, networks: ["somnia"] },
  { title: "Invoices", url: "/invoices", icon: FileText, networks: ["somnia"] },
  { title: "Contractors", url: "/contractors", icon: Users, networks: ["somnia"] },
  { title: "Swaps", url: "/swaps", icon: ArrowLeftRight, networks: ["somnia"] },
  { title: "Yield", url: "/yield", icon: TrendingUp, networks: ["somnia"] },
  { title: "Privacy", url: "/privacy", icon: EyeOff, networks: ["somnia"] },
  { title: "Risk", url: "/risk", icon: ShieldAlert, networks: ["somnia"] },
  { title: "Reputation", url: "/reputation", icon: Trophy, networks: ["somnia"] },
  { title: "Oracle", url: "/oracle", icon: Gauge, networks: ["somnia"] },
  { title: "Policies", url: "/policies", icon: SlidersHorizontal, networks: ["somnia"] },
  { title: "Operator", url: "/operator", icon: ShieldCheck, networks: ["somnia"] },
  { title: "Audit", url: "/audit", icon: ScrollText, networks: ["somnia"] },
  { title: "Status", url: "/status", icon: Activity, networks: ["somnia"] },
] as const;

const COMMUNITY_MODE_KEY = "arcpay-somnia-community-mode";
export const COMMUNITY_MODE_EVENT = "arcpay-somnia-community-mode-change";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const network = useNetwork((s) => s.mode);
  const admin = useAdminAccess();
  const [communityMode, setCommunityMode] = useState(true);
  const isActive = (url: string) => path === url || path.startsWith(url + "/");
  const effectiveCommunityMode = !admin.admin || communityMode;
  const visibleItems = useMemo(() => ITEMS.filter((item) => {
    if (!isEnabledForNetwork(item.networks, network)) return false;
    return !effectiveCommunityMode || COMMUNITY_ROUTES.has(item.url);
  }), [effectiveCommunityMode, network]);

  useEffect(() => {
    const stored = window.localStorage.getItem(COMMUNITY_MODE_KEY);
    setCommunityMode(admin.admin ? stored !== "off" : true);
    const sync = () => setCommunityMode(admin.admin ? window.localStorage.getItem(COMMUNITY_MODE_KEY) !== "off" : true);
    window.addEventListener(COMMUNITY_MODE_EVENT, sync);
    return () => window.removeEventListener(COMMUNITY_MODE_EVENT, sync);
  }, [admin.admin]);

  function toggleMode() {
    if (!admin.admin) return;
    const next = !communityMode;
    setCommunityMode(next);
    window.localStorage.setItem(COMMUNITY_MODE_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(COMMUNITY_MODE_EVENT));
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/dashboard" className="flex items-center gap-2 px-1">
          <LogoIcon className="w-6 h-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
              ArcPay
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Treasury</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{effectiveCommunityMode ? "Community mode" : "Workspace"}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {admin.admin ? (
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip={communityMode ? "Show full console" : "Show community mode"} onClick={toggleMode}>
                    <Wrench className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{communityMode ? "Show full console" : "Community mode"}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")} tooltip="Settings">
                  <Link to="/settings" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function isEnabledForNetwork(networks: readonly NetworkMode[], current: NetworkMode) {
  return networks.includes(current);
}
