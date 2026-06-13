import { paymentsConfig, isCardConfigured } from "@/lib/payments/config";
import type { CreatePaymentInput, PaymentProvider, ProviderInitResult } from "@/lib/payments/types";

export const cardProvider: PaymentProvider = {
  id: "card",
  label: "Card",
  isConfigured: isCardConfigured,
  supportedPurposes: ["wallet_deposit", "commitment_payment"],
  async initiate(input: CreatePaymentInput & { intentId: string }): Promise<ProviderInitResult> {
    const cfg = paymentsConfig();
    const amountUsd =
      input.currency === "USD" && input.metadata?.amountUsd
        ? Number(input.metadata.amountUsd)
        : Math.max(1, Math.round(input.amountKes / (Number(process.env.NEXT_PUBLIC_KES_PER_USD) || 129)));

    if (cfg.sandbox && !isCardConfigured()) {
      return {
        status: "requires_action",
        externalId: `SANDBOX-CARD-${input.intentId.slice(0, 8)}`,
        action: {
          type: "redirect",
          url: `${cfg.appUrl}/payments/checkout?intent=${input.intentId}&provider=card&sandbox=1`,
        },
        paymentData: { amountUsd, sandbox: true },
        providerResponse: { simulated: true },
      };
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(cfg.stripe.secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: input.intentId,
      metadata: {
        payment_intent_id: input.intentId,
        purpose: input.purpose,
        user_id: input.userId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: input.currency === "USD" ? "usd" : "usd",
            unit_amount: Math.round(amountUsd * 100),
            product_data: {
              name:
                input.purpose === "wallet_deposit"
                  ? "Afriekeza wallet deposit"
                  : "Afriekeza investment payment",
            },
          },
        },
      ],
      success_url: `${cfg.appUrl}/payments/complete?intent=${input.intentId}&status=success`,
      cancel_url: `${cfg.appUrl}/payments/complete?intent=${input.intentId}&status=cancelled`,
    });

    return {
      status: "requires_action",
      externalId: session.id,
      action: { type: "redirect", url: session.url! },
      paymentData: { checkoutSessionId: session.id, amountUsd },
      providerResponse: { sessionId: session.id },
    };
  },
};
