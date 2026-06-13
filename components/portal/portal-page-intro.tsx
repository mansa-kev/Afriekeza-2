import { cn } from "@/lib/utils";

type PortalPageIntroProps = {
  title: string;
  description?: string;
  greeting?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
};

export function PortalPageIntro({
  title,
  description,
  greeting,
  action,
  compact,
  className,
}: PortalPageIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        compact ? "mb-5" : "mb-6",
        className,
      )}
    >
      <div className="min-w-0">
        {greeting && (
          <p className="text-sm font-medium text-muted">{greeting}</p>
        )}
        <h1
          className={cn(
            "font-display font-bold tracking-tight text-navy",
            compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted md:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
