import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { recordWebhookEvent, settlePaymentIntent } from "@/lib/payments/service";

type MpesaCallback = {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: Array<{ Name?: string; Value?: string | number }>;
      };
    };
  };
};

export async function POST(request: Request) {
  const payload = (await request.json()) as MpesaCallback;
  const callback = payload.Body?.stkCallback;
  if (!callback?.CheckoutRequestID) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback" });
  }

  const externalId = callback.CheckoutRequestID;
  await recordWebhookEvent("mpesa", externalId, payload as Record<string, unknown>);

  const admin = createAdminClient();
  const { data: intent } = await admin
    .from("payment_intents")
    .select("id")
    .eq("external_id", externalId)
    .maybeSingle();

  if (!intent) {
    const ref = callback.CallbackMetadata?.Item?.find((i) => i.Name === "AccountReference")?.Value;
    if (ref) {
      const { data: byRef } = await admin
        .from("payment_intents")
        .select("id")
        .ilike("id", `${String(ref).slice(0, 8)}%`)
        .maybeSingle();
      if (byRef) {
        if (callback.ResultCode === 0) {
          await settlePaymentIntent(byRef.id);
        } else {
          await admin
            .from("payment_intents")
            .update({ status: "failed", failure_reason: callback.ResultDesc })
            .eq("id", byRef.id);
        }
      }
    }
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  if (callback.ResultCode === 0) {
    await settlePaymentIntent(intent.id);
  } else {
    await admin
      .from("payment_intents")
      .update({ status: "failed", failure_reason: callback.ResultDesc })
      .eq("id", intent.id);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
