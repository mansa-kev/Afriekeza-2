export type PaymentProviderId = "mpesa" | "card" | "crypto" | "wallet";

export type PaymentPurpose = "wallet_deposit" | "commitment_payment";

export type PaymentIntentStatus =
  | "created"
  | "pending"
  | "processing"
  | "requires_action"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentAction =
  | { type: "none"; message?: string }
  | { type: "redirect"; url: string }
  | { type: "stk_push"; message: string; checkoutRequestId?: string }
  | { type: "crypto"; address: string; network: string; amount: string; currency: string }
  | { type: "wallet"; message: string };

export type CreatePaymentInput = {
  userId: string;
  purpose: PaymentPurpose;
  provider: PaymentProviderId;
  amountKes: number;
  currency?: string;
  commitmentId?: string;
  phone?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
};

export type ProviderInitResult = {
  externalId?: string;
  status: PaymentIntentStatus;
  action: PaymentAction;
  providerResponse?: Record<string, unknown>;
  paymentData?: Record<string, unknown>;
};

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  isConfigured: () => boolean;
  supportedPurposes: PaymentPurpose[];
  initiate: (input: CreatePaymentInput & { intentId: string }) => Promise<ProviderInitResult>;
};

export type PaymentIntentRecord = {
  id: string;
  user_id: string;
  purpose: PaymentPurpose;
  provider: PaymentProviderId;
  amount_kes: number;
  currency: string;
  status: PaymentIntentStatus;
  external_id: string | null;
  commitment_id: string | null;
  payment_data: Record<string, unknown>;
  failure_reason: string | null;
  created_at: string;
  completed_at: string | null;
};
