import Link from "next/link";
import { cn } from "@/lib/utils";

type PortalAlertCardProps = {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  href?: string;
  className?: string;
};

const PRIORITY_STYLES = {
  high: {
    card: "border-risk-red/20 bg-red-50/60",
    badge: "bg-red-100 text-risk-red",
    label: "High priority",
  },
  medium: {
    card: "border-warning/25 bg-amber-50/50",
    badge: "bg-amber-100 text-warning",
    label: "Medium priority",
  },
  low: {
    card: "border-header-border bg-off-white",
    badge: "bg-off-white text-muted",
    label: "Low priority",
  },
};

export function PortalAlertCard({
  title,
  description,
  priority,
  href,
  className,
}: PortalAlertCardProps) {
  const styles = PRIORITY_STYLES[priority];

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-dark">{title}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            styles.badge,
          )}
        >
          {styles.label}
        </span>
      </div>
      {description && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{description}</p>
      )}
    </>
  );

  const cardClass = cn(
    "rounded-xl border p-4 transition-colors",
    styles.card,
    href && "hover:border-blue/25 hover:shadow-sm",
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
