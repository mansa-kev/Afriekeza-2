import { paymentsConfig, isMpesaConfigured } from "@/lib/payments/config";
import type { CreatePaymentInput, PaymentProvider, ProviderInitResult } from "@/lib/payments/types";

async function getMpesaToken(): Promise<string> {
  const cfg = paymentsConfig().mpesa;
  const auth = Buffer.from(`${cfg.consumerKey}:${cfg.consumerSecret}`).toString("base64");
  const base =
    cfg.environment === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = (await res.json()) as { access_token?: string; errorMessage?: string };
  if (!data.access_token) {
    throw new Error(data.errorMessage ?? "M-Pesa auth failed");
  }
  return data.access_token;
}

function stkPassword(shortcode: string, passkey: string): { password: string; timestamp: string } {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  return { password, timestamp };
}

export const mpesaProvider: PaymentProvider = {
  id: "mpesa",
  label: "M-Pesa",
  isConfigured: isMpesaConfigured,
  supportedPurposes: ["wallet_deposit", "commitment_payment"],
  async initiate(input: CreatePaymentInput & { intentId: string }): Promise<ProviderInitResult> {
    const cfg = paymentsConfig();
    const phone = input.phone?.replace(/\D/g, "").replace(/^0/, "254") ?? "";

    if (!phone || phone.length < 11) {
      throw new Error("Valid M-Pesa phone number is required (e.g. 2547XXXXXXXX)");
    }

    if (cfg.sandbox && !isMpesaConfigured()) {
      return {
        status: "processing",
        externalId: `SANDBOX-MPESA-${input.intentId.slice(0, 8)}`,
        action: {
          type: "stk_push",
          message: "Sandbox: M-Pesa STK push simulated. Payment will confirm automatically.",
          checkoutRequestId: `sandbox-${input.intentId}`,
        },
        paymentData: { phone, sandbox: true },
        providerResponse: { simulated: true },
      };
    }

    const { mpesa, appUrl } = cfg;
    const token = await getMpesaToken();
    const base =
      mpesa.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
    const { password, timestamp } = stkPassword(mpesa.shortcode, mpesa.passkey);
    const callbackUrl =
      mpesa.callbackUrl || `${appUrl}/api/webhooks/mpesa`;

    const body = {
      BusinessShortCode: mpesa.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(input.amountKes),
      PartyA: phone,
      PartyB: mpesa.shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: input.intentId.slice(0, 12),
      TransactionDesc: input.purpose === "wallet_deposit" ? "Wallet top-up" : "Investment payment",
    };

    const res = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
      ResponseCode?: string;
      ResponseDescription?: string;
      errorMessage?: string;
    };

    if (data.ResponseCode !== "0") {
      throw new Error(data.errorMessage ?? data.ResponseDescription ?? "M-Pesa STK push failed");
    }

    return {
      status: "processing",
      externalId: data.CheckoutRequestID,
      action: {
        type: "stk_push",
        message: "Check your phone to approve the M-Pesa payment.",
        checkoutRequestId: data.CheckoutRequestID,
      },
      paymentData: { phone, merchantRequestId: data.MerchantRequestID },
      providerResponse: data as Record<string, unknown>,
    };
  },
};
