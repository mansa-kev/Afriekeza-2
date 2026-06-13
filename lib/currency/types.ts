export type CurrencyCode = "KES" | "USD";

export const CURRENCIES: Record<
  CurrencyCode,
  { code: CurrencyCode; label: string; symbol: string; locale: string }
> = {
  KES: { code: "KES", label: "Kenyan Shilling", symbol: "KES", locale: "en-KE" },
  USD: { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
};

/** Reference rate for display conversion — update via admin settings later */
export const DEFAULT_KES_PER_USD = 129;
