import { randomBytes } from "crypto";
import { paymentsConfig, isCryptoConfigured } from "@/lib/payments/config";
import type { CreatePaymentInput, PaymentProvider, ProviderInitResult } from "@/lib/payments/types";

export const cryptoProvider: PaymentProvider = {
  id: "crypto",
  label: "Crypto",
  isConfigured: isCryptoConfigured,
  supportedPurposes: ["wallet_deposit", "commitment_payment"],
  async initiate(input: CreatePaymentInput & { intentId: string }): Promise<ProviderInitResult> {
    const cfg = paymentsConfig();
    const network = (input.metadata?.network as string) ?? "USDC-ETH";
    const [asset, chain] = network.split("-");
    const amountUsd =
      input.metadata?.amountUsd != null
        ? String(input.metadata.amountUsd)
        : (input.amountKes / (Number(process.env.NEXT_PUBLIC_KES_PER_USD) || 129)).toFixed(2);

    if (cfg.sandbox && !isCryptoConfigured()) {
      const address = `0xSANDBOX${randomBytes(10).toString("hex")}`;
      return {
        status: "requires_action",
        externalId: `SANDBOX-CRYPTO-${input.intentId.slice(0, 8)}`,
        action: {
          type: "crypto",
          address,
          network: `${asset}-${chain}`,
          amount: amountUsd,
          currency: asset ?? "USDC",
        },
        paymentData: { address, network, amountUsd, sandbox: true },
        providerResponse: { simulated: true },
      };
    }

    // Generic crypto gateway hook — replace with Coinbase Commerce / NOWPayments API call
    const res = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": cfg.crypto.apiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: input.purpose === "wallet_deposit" ? "Wallet deposit" : "Investment payment",
        description: `Afriekeza payment ${input.intentId}`,
        pricing_type: "fixed_price",
        local_price: { amount: amountUsd, currency: "USD" },
        metadata: { payment_intent_id: input.intentId },
        redirect_url: `${cfg.appUrl}/payments/complete?intent=${input.intentId}&status=success`,
        cancel_url: `${cfg.appUrl}/payments/complete?intent=${input.intentId}&status=cancelled`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Crypto payment initiation failed: ${err}`);
    }

    const charge = (await res.json()) as {
      data: {
        id: string;
        addresses: Record<string, string>;
        pricing: { local: { amount: string; currency: string } };
      };
    };

    const address = charge.data.addresses?.ethereum ?? Object.values(charge.data.addresses)[0];

    return {
      status: "requires_action",
      externalId: charge.data.id,
      action: {
        type: "crypto",
        address,
        network: "USDC-ETH",
        amount: charge.data.pricing.local.amount,
        currency: charge.data.pricing.local.currency,
      },
      paymentData: { chargeId: charge.data.id, address },
      providerResponse: charge.data as unknown as Record<string, unknown>,
    };
  },
};
