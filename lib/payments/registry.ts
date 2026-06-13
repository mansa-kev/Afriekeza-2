import { mpesaProvider } from "@/lib/payments/providers/mpesa";
import { cardProvider } from "@/lib/payments/providers/card";
import { cryptoProvider } from "@/lib/payments/providers/crypto";
import type { PaymentProvider, PaymentProviderId } from "@/lib/payments/types";

const providers: Record<PaymentProviderId, PaymentProvider | undefined> = {
  mpesa: mpesaProvider,
  card: cardProvider,
  crypto: cryptoProvider,
  wallet: undefined,
};

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider {
  const provider = providers[id];
  if (!provider) {
    throw new Error(`Payment provider "${id}" is not available`);
  }
  return provider;
}

export function listPaymentProviders(): PaymentProvider[] {
  return [mpesaProvider, cardProvider, cryptoProvider];
}
