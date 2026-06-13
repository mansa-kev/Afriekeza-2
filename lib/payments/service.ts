import { createAdminClient } from "@/lib/supabase/admin";
import { enabledProviders, paymentsConfig } from "@/lib/payments/config";
import { getPaymentProvider } from "@/lib/payments/registry";
import type {
  CreatePaymentInput,
  PaymentAction,
  PaymentIntentRecord,
  PaymentProviderId,
} from "@/lib/payments/types";

export async function settlePaymentIntent(intentId: string) {
  const admin = createAdminClient();
  const { error } = await admin.rpc("settle_payment_intent", { p_intent_id: intentId });
  if (error) throw new Error(error.message);
}

export async function markIntentFailed(intentId: string, reason: string) {
  const admin = createAdminClient();
  await admin
    .from("payment_intents")
    .update({ status: "failed", failure_reason: reason })
    .eq("id", intentId);
}

export async function completeSandboxIntent(intentId: string) {
  if (!paymentsConfig().sandbox) {
    throw new Error("Sandbox completion is disabled");
  }
  const admin = createAdminClient();
  await admin
    .from("payment_intents")
    .update({ status: "processing", external_id: `SANDBOX-${intentId.slice(0, 8)}` })
    .eq("id", intentId);
  await settlePaymentIntent(intentId);
}

export async function createPaymentIntent(
  input: CreatePaymentInput,
): Promise<{ intent: PaymentIntentRecord; action: PaymentAction }> {
  if (!enabledProviders().includes(input.provider)) {
    throw new Error(`Payment provider "${input.provider}" is not enabled. Configure credentials in environment.`);
  }

  const provider = getPaymentProvider(input.provider);
  if (!provider.supportedPurposes.includes(input.purpose)) {
    throw new Error(`${provider.label} does not support ${input.purpose}`);
  }

  if (!provider.isConfigured() && !paymentsConfig().sandbox) {
    throw new Error(`${provider.label} is not configured. Add provider API keys to environment.`);
  }

  const admin = createAdminClient();
  const idempotencyKey =
    input.idempotencyKey ?? `${input.userId}-${input.purpose}-${input.provider}-${Date.now()}`;

  const { data: intent, error } = await admin
    .from("payment_intents")
    .insert({
      user_id: input.userId,
      purpose: input.purpose,
      provider: input.provider,
      amount_kes: input.amountKes,
      currency: input.currency ?? "KES",
      commitment_id: input.commitmentId ?? null,
      idempotency_key: idempotencyKey,
      status: "created",
    })
    .select("*")
    .single();

  if (error || !intent) {
    throw new Error(error?.message ?? "Failed to create payment intent");
  }

  try {
    const result = await provider.initiate({ ...input, intentId: intent.id });

    const { data: updated, error: updateError } = await admin
      .from("payment_intents")
      .update({
        status: result.status,
        external_id: result.externalId ?? null,
        payment_data: result.paymentData ?? {},
        provider_response: result.providerResponse ?? {},
      })
      .eq("id", intent.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message ?? "Failed to update payment intent");
    }

    if (paymentsConfig().sandbox && (result.paymentData as { sandbox?: boolean })?.sandbox) {
      await completeSandboxIntent(intent.id);
      const settled = await getPaymentIntent(intent.id);
      return {
        intent: (settled ?? updated) as PaymentIntentRecord,
        action: { type: "none" as const, message: "Payment confirmed (sandbox)." },
      };
    }

    return {
      intent: updated as PaymentIntentRecord,
      action: result.action,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment initiation failed";
    await markIntentFailed(intent.id, message);
    throw err;
  }
}

export async function getPaymentIntent(intentId: string, userId?: string) {
  const admin = createAdminClient();
  let query = admin.from("payment_intents").select("*").eq("id", intentId);
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data as PaymentIntentRecord | null;
}

export async function recordWebhookEvent(
  provider: PaymentProviderId,
  externalEventId: string,
  payload: Record<string, unknown>,
  intentId?: string,
) {
  const admin = createAdminClient();
  await admin.from("payment_webhook_events").upsert(
    {
      provider,
      external_event_id: externalEventId,
      payload,
      payment_intent_id: intentId ?? null,
      processed_at: new Date().toISOString(),
    },
    { onConflict: "provider,external_event_id" },
  );
}
