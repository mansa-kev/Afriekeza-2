import type { PaymentProviderId } from "@/lib/payments/types";

export function paymentsConfig() {
  return {
    sandbox: process.env.PAYMENTS_SANDBOX === "true",
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    mpesa: {
      consumerKey: process.env.MPESA_CONSUMER_KEY ?? "",
      consumerSecret: process.env.MPESA_CONSUMER_SECRET ?? "",
      shortcode: process.env.MPESA_SHORTCODE ?? "",
      passkey: process.env.MPESA_PASSKEY ?? "",
      callbackUrl: process.env.MPESA_CALLBACK_URL ?? "",
      environment: process.env.MPESA_ENVIRONMENT ?? "sandbox",
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY ?? "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    },
    crypto: {
      apiKey: process.env.CRYPTO_PAYMENTS_API_KEY ?? "",
      webhookSecret: process.env.CRYPTO_WEBHOOK_SECRET ?? "",
      provider: process.env.CRYPTO_PAYMENTS_PROVIDER ?? "generic",
    },
  };
}

export function isMpesaConfigured() {
  const c = paymentsConfig().mpesa;
  return Boolean(c.consumerKey && c.consumerSecret && c.shortcode && c.passkey);
}

export function isCardConfigured() {
  return Boolean(paymentsConfig().stripe.secretKey);
}

export function isCryptoConfigured() {
  const c = paymentsConfig().crypto;
  return Boolean(c.apiKey && c.webhookSecret);
}

export function enabledProviders(): PaymentProviderId[] {
  const cfg = paymentsConfig();
  const providers: PaymentProviderId[] = ["wallet"];

  if (isMpesaConfigured() || cfg.sandbox) providers.unshift("mpesa");
  if (isCardConfigured() || cfg.sandbox) providers.push("card");
  if (isCryptoConfigured() || cfg.sandbox) providers.push("crypto");

  return [...new Set(providers)];
}
