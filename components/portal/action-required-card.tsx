import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionRequiredCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber";
};

const TONE_STYLES = {
  blue: {
    bg: "bg-soft-blue/60",
    icon: "bg-blue/10 text-blue",
    button: "bg-blue text-white hover:bg-blue/90",
  },
  green: {
    bg: "bg-soft-green/60",
    icon: "bg-green/10 text-green",
    button: "bg-green text-white hover:bg-green/90",
  },
  amber: {
    bg: "bg-amber-50/80",
    icon: "bg-warning/10 text-warning",
    button: "bg-warning text-white hover:bg-warning/90",
  },
};

export function ActionRequiredCard({
  title,
  description,
  href,
  cta,
  icon: Icon,
  tone = "blue",
}: ActionRequiredCardProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-header-border p-5 shadow-sm",
        styles.bg,
      )}
    >
      <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg", styles.icon)}>
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-semibold text-dark">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href={href}
        className={cn(
          "mt-4 inline-flex w-fit items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          styles.button,
        )}
      >
        {cta}
      </Link>
    </div>
  );
}
