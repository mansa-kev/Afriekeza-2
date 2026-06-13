"use client";

import { useCurrency } from "@/lib/currency/context";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency/types";
import { cn } from "@/lib/utils";

type CurrencySwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function CurrencySwitcher({ className, compact }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-header-border bg-white p-0.5",
        className,
      )}
      role="group"
      aria-label="Display currency"
    >
      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            currency === code
              ? "bg-navy text-white"
              : "text-muted hover:text-dark",
            compact && "px-2.5",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
