import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  className?: string;
  dense?: boolean;
  icon?: LucideIcon;
  href?: string;
};

export function MetricCard({
  label,
  value,
  hint,
  trend,
  className,
  dense,
  icon: Icon,
  href,
}: MetricCardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-soft-blue text-blue">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-1 font-bold tabular-nums text-dark",
          dense ? "text-xl" : "text-2xl",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {trend && (
        <p className="mt-2 text-xs font-medium text-green">{trend}</p>
      )}
      {href && (
        <span className="mt-3 inline-block text-xs font-medium text-blue">
          View report →
        </span>
      )}
    </>
  );

  const cardClass = cn(
    "rounded-xl border border-header-border bg-white shadow-sm transition-shadow hover:shadow-md",
    dense ? "p-4" : "p-5",
    href && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
