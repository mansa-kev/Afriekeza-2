import Link from "next/link";
import { cn } from "@/lib/utils";

type PortalStatChipProps = {
  label: string;
  value?: string | number;
  href?: string;
  tone?: "default" | "blue" | "green" | "amber" | "red";
  className?: string;
};

const TONE_STYLES = {
  default: "bg-off-white text-dark border-header-border",
  blue: "bg-soft-blue text-blue border-blue/15",
  green: "bg-soft-green text-green border-green/15",
  amber: "bg-amber-50 text-warning border-warning/20",
  red: "bg-red-50 text-risk-red border-risk-red/15",
};

export function PortalStatChip({
  label,
  value,
  href,
  tone = "default",
  className,
}: PortalStatChipProps) {
  const content = (
    <>
      {value !== undefined && (
        <span className="text-lg font-bold tabular-nums">{value}</span>
      )}
      <span
        className={cn(
          "font-medium",
          value !== undefined ? "text-xs text-muted" : "text-sm text-dark",
        )}
      >
        {label}
      </span>
    </>
  );

  const classes = cn(
    "inline-flex min-w-[7rem] flex-col gap-0.5 rounded-lg border px-3.5 py-2.5 transition-colors",
    TONE_STYLES[tone],
    href && "hover:border-blue/30 hover:shadow-sm",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
