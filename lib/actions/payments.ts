"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPaymentIntent } from "@/lib/payments/service";
import { payCommitmentFromWallet } from "@/lib/actions/operational";
import type { PaymentProviderId, PaymentPurpose } from "@/lib/payments/types";
import { enabledProviders } from "@/lib/payments/config";

export async function initiatePayment(data: {
  purpose: PaymentPurpose;
  provider: PaymentProviderId;
  amountKes: number;
  phone?: string;
  commitmentId?: string;
  currency?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  try {
    const { intent, action } = await createPaymentIntent({
      userId: user.id,
      purpose: data.purpose,
      provider: data.provider,
      amountKes: data.amountKes,
      phone: data.phone,
      commitmentId: data.commitmentId,
      currency: data.currency,
    });

    revalidatePath("/investor/wallet");
    revalidatePath("/investor/portfolio");
    revalidatePath("/admin/payments");

    return { success: true, intentId: intent.id, status: intent.status, action };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Payment failed" };
  }
}

export async function payWithWallet(commitmentId: string) {
  const result = await payCommitmentFromWallet(commitmentId);
  revalidatePath("/investor/portfolio");
  revalidatePath("/investor/wallet");
  return result;
}

export async function getEnabledPaymentProviders() {
  return enabledProviders();
}
