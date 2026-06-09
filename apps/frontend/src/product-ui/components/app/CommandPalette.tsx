import {
  CommandInput,
  Command,
} from "@/components/ui/command";
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
  RadioTower,
  Trophy,
  Activity,
} from "lucide-react";

const NAV = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Wallet", to: "/wallet", icon: Wallet },
  { label: "Agents", to: "/agents", icon: Users },
  { label: "x402", to: "/x402", icon: RadioTower },
  { label: "Payments", to: "/payments", icon: Send },
  { label: "Invoices", to: "/invoices", icon: FileText },
  { label: "Contractors", to: "/contractors", icon: Users },
  { label: "Swaps", to: "/swaps", icon: ArrowLeftRight },
  { label: "Yield", to: "/yield", icon: TrendingUp },
  { label: "Privacy", to: "/privacy", icon: EyeOff },
  { label: "Risk", to: "/risk", icon: ShieldAlert },
  { label: "Reputation", to: "/reputation", icon: Trophy },
  { label: "Policies", to: "/policies", icon: SlidersHorizontal },
  { label: "Audit", to: "/audit", icon: ScrollText },
  { label: "Status", to: "/status", icon: Activity },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35 p-4 backdrop-blur-sm" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <div
        className="mx-auto mt-20 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Command className="bg-popover">
          <CommandInput placeholder="Jump to a page..." autoFocus />
          <div className="max-h-[420px] overflow-y-auto p-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Navigation</div>
            <div className="grid gap-1">
              {NAV.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    window.location.assign(item.to);
                  }}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition hover:bg-muted"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
