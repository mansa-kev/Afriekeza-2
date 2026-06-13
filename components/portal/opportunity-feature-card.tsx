import Link from "next/link";
import { cn } from "@/lib/utils";

type OpportunityFeatureCardProps = {
  title: string;
  instrument?: string;
  minInvestment?: number | null;
  tenorMonths?: number | null;
  targetReturn?: number | null;
  riskLabel?: string | null;
  href: string;
  className?: string;
};

function formatKes(amount: number) {
  return `KES ${amount.toLocaleString()}`;
}

export function OpportunityFeatureCard({
  title,
  instrument,
  minInvestment,
  tenorMonths,
  targetReturn,
  riskLabel,
  href,
  className,
}: OpportunityFeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-header-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      {instrument && (
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {instrument}
        </p>
      )}
      <h3 className="mt-1 font-semibold text-dark">{title}</h3>

      <dl className="mt-4 space-y-2 text-sm">
        {minInvestment != null && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Min. investment</dt>
            <dd className="font-medium text-dark">{formatKes(minInvestment)}</dd>
          </div>
        )}
        {tenorMonths != null && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Tenor</dt>
            <dd className="font-medium text-dark">{tenorMonths} months</dd>
          </div>
        )}
        {targetReturn != null && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Target return</dt>
            <dd className="font-medium text-green">Up to {targetReturn}% p.a.</dd>
          </div>
        )}
        {riskLabel && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Risk level</dt>
            <dd className="font-medium capitalize text-dark">{riskLabel}</dd>
          </div>
        )}
      </dl>

      <Link
        href={href}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue/90"
      >
        View details
      </Link>
    </div>
  );
}
