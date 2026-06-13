import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted/10 text-muted",
  submitted: "bg-blue/10 text-blue",
  "under-review": "bg-blue/10 text-blue",
  approved: "bg-green/10 text-green",
  "action-required": "bg-warning/10 text-warning",
  rejected: "bg-risk-red/10 text-risk-red",
  open: "bg-green/10 text-green",
  closed: "bg-muted/10 text-muted",
  delayed: "bg-warning/10 text-warning",
  repaid: "bg-navy/10 text-navy",
  "coming-soon": "bg-soft-blue text-blue",
  default: "bg-off-white text-muted",
};

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const key = status.toLowerCase().replace(/\s+/g, "-");
  const style = STATUS_STYLES[key] ?? STATUS_STYLES.default;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
}
