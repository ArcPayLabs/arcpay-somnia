import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  emphasis = false,
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: string;
  readonly delta?: { readonly value: string; readonly direction: "up" | "down" | "flat" };
  readonly icon?: LucideIcon;
  readonly emphasis?: boolean;
}) {
  return (
    <div className={`stat-card ${emphasis ? "emphasis" : ""}`}>
      <div className="stat-card-top">
        <span>{label}</span>
        {Icon ? <i><Icon size={17} /></i> : null}
      </div>
      <div className="stat-card-value">
        <strong>{value}</strong>
        {delta ? (
          <em className={delta.direction}>
            {delta.direction === "up" ? <ArrowUpRight size={14} /> : delta.direction === "down" ? <ArrowDownRight size={14} /> : null}
            {delta.value}
          </em>
        ) : null}
      </div>
      {hint ? <p>{hint}</p> : null}
    </div>
  );
}
