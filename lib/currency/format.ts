import { CURRENCIES, DEFAULT_KES_PER_USD, type CurrencyCode } from "./types";

export function convertAmount(
  amountKes: number,
  target: CurrencyCode,
  rate = DEFAULT_KES_PER_USD,
): number {
  if (target === "KES") return amountKes;
  return amountKes / rate;
}

export function formatCurrency(
  amountKes: number,
  currency: CurrencyCode,
  options?: { compact?: boolean; rate?: number },
): string {
  const rate = options?.rate ?? DEFAULT_KES_PER_USD;
  const value = convertAmount(amountKes, currency, rate);
  const meta = CURRENCIES[currency];

  if (currency === "USD") {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: "USD",
      notation: options?.compact ? "compact" : "standard",
      maximumFractionDigits: options?.compact ? 1 : 2,
    }).format(value);
  }

  return `${meta.symbol} ${new Intl.NumberFormat(meta.locale, {
    notation: options?.compact ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(value)}`;
}
