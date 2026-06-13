import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { paymentsConfig } from "@/lib/payments/config";
import { recordWebhookEvent, settlePaymentIntent } from "@/lib/payments/service";

export async function POST(request: Request) {
  const cfg = paymentsConfig().stripe;
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!cfg.secretKey || !cfg.webhookSecret || !sig) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(cfg.secretKey);

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, cfg.webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await recordWebhookEvent("card", event.id, event as unknown as Record<string, unknown>);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session;
    const intentId = session.metadata?.payment_intent_id ?? session.client_reference_id;
    if (intentId) {
      const admin = createAdminClient();
      await admin
        .from("payment_intents")
        .update({ external_id: session.id, status: "processing" })
        .eq("id", intentId);
      await settlePaymentIntent(intentId);
    }
  }

  return NextResponse.json({ received: true });
}
