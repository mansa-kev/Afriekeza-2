import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { paymentsConfig } from "@/lib/payments/config";
import { recordWebhookEvent, settlePaymentIntent } from "@/lib/payments/service";

function verifySignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return signature === expected;
  }
}

export async function POST(request: Request) {
  const cfg = paymentsConfig().crypto;
  const body = await request.text();
  const signature = request.headers.get("x-afriekeza-crypto-signature");

  if (!cfg.webhookSecret) {
    return NextResponse.json({ error: "Crypto webhooks not configured" }, { status: 503 });
  }

  if (!verifySignature(body, signature, cfg.webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as {
    id: string;
    type: string;
    data: { payment_intent_id?: string; charge_id?: string; status?: string };
  };

  await recordWebhookEvent("crypto", event.id, event as unknown as Record<string, unknown>);

  if (event.type === "payment.confirmed" && event.data.payment_intent_id) {
    const admin = createAdminClient();
    await admin
      .from("payment_intents")
      .update({
        external_id: event.data.charge_id ?? event.id,
        status: "processing",
      })
      .eq("id", event.data.payment_intent_id);
    await settlePaymentIntent(event.data.payment_intent_id);
  }

  return NextResponse.json({ received: true });
}
