import { cn } from "@/lib/utils";

type ComingSoonPanelProps = {
  title: string;
  description: string;
  className?: string;
};

export function ComingSoonPanel({
  title,
  description,
  className,
}: ComingSoonPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-header-border bg-gradient-to-br from-white to-off-white p-8",
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
        Coming soon
      </p>
      <h3 className="mt-2 text-lg font-semibold text-dark">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
