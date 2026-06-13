import { cn } from "@/lib/utils";

type PortalCardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
};

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function PortalCard({
  children,
  className,
  padding = "md",
  hover,
}: PortalCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-header-border bg-white shadow-sm",
        PADDING[padding],
        hover && "transition-shadow hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
