"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type AuditPayload = {
  entityType: string;
  entityId?: string;
  action: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  note?: string;
};

async function logAudit(payload: AuditPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.rpc("log_audit_event", {
    p_actor_id: user.id,
    p_entity_type: payload.entityType,
    p_entity_id: payload.entityId ?? null,
    p_action: payload.action,
    p_previous_state: payload.previousState ?? null,
    p_new_state: payload.newState ?? null,
    p_note: payload.note ?? null,
  });
}

export async function notifyUser(userId: string, title: string, body: string, link?: string) {
  const supabase = await createClient();
  await supabase.rpc("send_notification", {
    p_user_id: userId,
    p_title: title,
    p_body: body,
    p_link: link ?? null,
  });
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);
  revalidatePath("/investor/dashboard");
}

export async function requestWalletDeposit(data: {
  amountKes: number;
  mpesaReference: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: wallet } = await supabase
    .from("wallet_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!wallet) return { error: "Wallet not found" };

  const { data: tx, error } = await supabase
    .from("wallet_transactions")
    .insert({
      wallet_id: wallet.id,
      type: "deposit",
      amount_kes: data.amountKes,
      reference: data.mpesaReference,
      status: "pending",
      metadata: { channel: "mpesa", mode: "manual_reconciliation" },
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit({
    entityType: "wallet_transaction",
    entityId: tx.id,
    action: "deposit_requested",
    newState: { amount_kes: data.amountKes, reference: data.mpesaReference },
  });

  revalidatePath("/investor/wallet");
  revalidatePath("/admin/payments");
  return { success: true, id: tx.id };
}

export async function adminApproveDeposit(transactionId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("credit_wallet_from_deposit", {
    p_transaction_id: transactionId,
  });
  if (error) return { error: error.message };

  await logAudit({
    entityType: "wallet_transaction",
    entityId: transactionId,
    action: "deposit_approved",
  });

  revalidatePath("/admin/payments");
  revalidatePath("/investor/wallet");
  return { success: true };
}

export async function adminRejectDeposit(transactionId: string, reason?: string) {
  const supabase = await createClient();
  const { data: tx } = await supabase
    .from("wallet_transactions")
    .select("wallet_id")
    .eq("id", transactionId)
    .maybeSingle();

  let userId: string | undefined;
  if (tx?.wallet_id) {
    const { data: wallet } = await supabase
      .from("wallet_accounts")
      .select("user_id")
      .eq("id", tx.wallet_id)
      .maybeSingle();
    userId = wallet?.user_id;
  }

  const { error } = await supabase
    .from("wallet_transactions")
    .update({ status: "rejected", metadata: { rejection_reason: reason ?? "Not verified" } })
    .eq("id", transactionId);

  if (error) return { error: error.message };

  if (userId) {
    await notifyUser(
      userId,
      "Deposit not confirmed",
      reason ?? "We could not verify your M-Pesa reference. Contact support if you believe this is an error.",
      "/investor/wallet",
    );
  }

  await logAudit({
    entityType: "wallet_transaction",
    entityId: transactionId,
    action: "deposit_rejected",
    note: reason,
  });

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function payCommitmentFromWallet(commitmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!investor) return { error: "Investor profile not found" };

  const { data: commitment } = await supabase
    .from("commitments")
    .select("id, amount_kes, status, investor_id")
    .eq("id", commitmentId)
    .eq("investor_id", investor.id)
    .maybeSingle();

  if (!commitment) return { error: "Commitment not found" };
  if (commitment.status !== "pending_payment") {
    return { error: "Commitment is not awaiting payment" };
  }

  const { data: wallet } = await supabase
    .from("wallet_accounts")
    .select("id, available_balance_kes")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!wallet) return { error: "Wallet not found" };
  if (Number(wallet.available_balance_kes) < Number(commitment.amount_kes)) {
    return { error: "Insufficient wallet balance" };
  }

  const newBalance = Number(wallet.available_balance_kes) - Number(commitment.amount_kes);

  const { error: walletError } = await supabase
    .from("wallet_accounts")
    .update({ available_balance_kes: newBalance })
    .eq("id", wallet.id);

  if (walletError) return { error: walletError.message };

  await supabase.from("wallet_transactions").insert({
    wallet_id: wallet.id,
    type: "commitment",
    amount_kes: commitment.amount_kes,
    reference: commitment.id,
    status: "completed",
    metadata: { commitment_id: commitment.id },
  });

  const { error: commitError } = await supabase
    .from("commitments")
    .update({ status: "paid", payment_reference: `wallet:${wallet.id}` })
    .eq("id", commitmentId);

  if (commitError) return { error: commitError.message };

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_paid_from_wallet",
    newState: { amount_kes: commitment.amount_kes },
  });

  revalidatePath("/investor/portfolio");
  revalidatePath("/investor/wallet");
  revalidatePath("/admin/allocations");
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function submitCommitmentMpesaReference(
  commitmentId: string,
  mpesaReference: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!investor) return { error: "Investor profile not found" };

  const { error } = await supabase
    .from("commitments")
    .update({
      payment_reference: mpesaReference,
      status: "pending_payment",
    })
    .eq("id", commitmentId)
    .eq("investor_id", investor.id);

  if (error) return { error: error.message };

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_payment_submitted",
    newState: { payment_reference: mpesaReference },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/investor/portfolio");
  return { success: true };
}

export async function adminVerifyCommitmentPayment(commitmentId: string) {
  const supabase = await createClient();
  const { data: commitment } = await supabase
    .from("commitments")
    .select("id, investor_id")
    .eq("id", commitmentId)
    .maybeSingle();

  let userId: string | undefined;
  if (commitment?.investor_id) {
    const { data: investor } = await supabase
      .from("investor_profiles")
      .select("user_id")
      .eq("id", commitment.investor_id)
      .maybeSingle();
    userId = investor?.user_id;
  }

  const { error } = await supabase
    .from("commitments")
    .update({ status: "paid" })
    .eq("id", commitmentId);

  if (error) return { error: error.message };

  if (userId) {
    await notifyUser(
      userId,
      "Payment confirmed",
      "Your commitment payment has been verified and is ready for allocation.",
      "/investor/portfolio",
    );
  }

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_payment_verified",
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/allocations");
  return { success: true };
}

export async function refundCommitment(commitmentId: string) {
  const supabase = await createClient();
  const { data: commitment } = await supabase
    .from("commitments")
    .select("id, amount_kes, status, investor_id, payment_reference")
    .eq("id", commitmentId)
    .maybeSingle();

  if (!commitment) return { error: "Commitment not found" };

  let userId: string | undefined;
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("user_id")
    .eq("id", commitment.investor_id)
    .maybeSingle();
  userId = investor?.user_id;

  if (commitment.status === "paid" && commitment.payment_reference?.startsWith("wallet:") && userId) {
    const { data: wallet } = await supabase
      .from("wallet_accounts")
      .select("id, available_balance_kes")
      .eq("user_id", userId)
      .maybeSingle();

    if (wallet) {
      await supabase
        .from("wallet_accounts")
        .update({
          available_balance_kes: Number(wallet.available_balance_kes) + Number(commitment.amount_kes),
        })
        .eq("id", wallet.id);

      await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        type: "refund",
        amount_kes: commitment.amount_kes,
        reference: commitment.id,
        status: "completed",
      });
    }
  }

  const { error } = await supabase
    .from("commitments")
    .update({ status: "refunded" })
    .eq("id", commitmentId);

  if (error) return { error: error.message };

  if (userId) {
    await notifyUser(
      userId,
      "Commitment refunded",
      "Your commitment has been refunded. Contact support if you have questions.",
      "/investor/portfolio",
    );
  }

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_refunded",
  });

  revalidatePath("/admin/payments");
  revalidatePath("/investor/portfolio");
  return { success: true };
}

export async function createRepaymentSchedule(positionId: string, tenorMonths: number) {
  if (tenorMonths <= 0) return;
  const supabase = await createClient();
  const { data: position } = await supabase
    .from("portfolio_positions")
    .select("id, principal_kes")
    .eq("id", positionId)
    .maybeSingle();
  if (!position) return;

  const installment = Number(position.principal_kes) / tenorMonths;
  const today = new Date();

  for (let i = 1; i <= tenorMonths; i++) {
    const due = new Date(today);
    due.setMonth(due.getMonth() + i);
    await supabase.from("repayments").insert({
      position_id: positionId,
      amount_kes: installment,
      due_date: due.toISOString().slice(0, 10),
      status: "scheduled",
    });
  }
}

export async function recordRepaymentPaid(repaymentId: string) {
  const supabase = await createClient();
  const { data: repayment } = await supabase
    .from("repayments")
    .select("id, position_id, amount_kes")
    .eq("id", repaymentId)
    .maybeSingle();

  let userId: string | undefined;
  if (repayment?.position_id) {
    const { data: position } = await supabase
      .from("portfolio_positions")
      .select("investor_id")
      .eq("id", repayment.position_id)
      .maybeSingle();
    if (position?.investor_id) {
      const { data: investor } = await supabase
        .from("investor_profiles")
        .select("user_id")
        .eq("id", position.investor_id)
        .maybeSingle();
      userId = investor?.user_id;
    }
  }

  const { error } = await supabase
    .from("repayments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", repaymentId);

  if (error) return { error: error.message };

  if (userId) {
    await notifyUser(
      userId,
      "Repayment received",
      `KES ${Number(repayment?.amount_kes).toLocaleString()} repayment recorded for your position.`,
      "/investor/portfolio",
    );
  }

  await logAudit({
    entityType: "repayment",
    entityId: repaymentId,
    action: "repayment_recorded",
  });

  revalidatePath("/investor/portfolio");
  revalidatePath("/admin/payments");
  return { success: true };
}

export async function saveUseOfFundsItem(data: {
  id?: string;
  companyId: string;
  category: string;
  budgetKes: number;
  actualKes: number;
  varianceNote?: string;
  opportunityId?: string;
}) {
  const supabase = await createClient();
  const payload = {
    company_id: data.companyId,
    category: data.category,
    budget_kes: data.budgetKes,
    actual_kes: data.actualKes,
    variance_note: data.varianceNote,
    opportunity_id: data.opportunityId ?? null,
  };

  if (data.id) {
    const { error } = await supabase.from("use_of_funds_items").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("use_of_funds_items").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/business/use-of-funds");
  return { success: true };
}

export async function saveCapTableEntry(data: {
  id?: string;
  companyId: string;
  holderName: string;
  shareClass: string;
  units: number;
  ownershipPct?: number;
}) {
  const supabase = await createClient();
  const payload = {
    company_id: data.companyId,
    holder_name: data.holderName,
    share_class: data.shareClass,
    units: data.units,
    ownership_pct: data.ownershipPct,
  };

  if (data.id) {
    const { error } = await supabase.from("cap_table_entries").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cap_table_entries").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/business/registry-portal");
  return { success: true };
}

export async function saveEsopPool(data: {
  id?: string;
  companyId: string;
  poolName: string;
  allocatedUnits: number;
  reservedUnits: number;
}) {
  const supabase = await createClient();
  const payload = {
    company_id: data.companyId,
    pool_name: data.poolName,
    allocated_units: data.allocatedUnits,
    reserved_units: data.reservedUnits,
  };

  if (data.id) {
    const { error } = await supabase.from("esop_pools").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("esop_pools").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/business/registry-portal");
  return { success: true };
}

export async function saveIssuerReport(data: {
  id?: string;
  companyId: string;
  periodLabel: string;
  summary: string;
  opportunityId?: string;
  submit?: boolean;
}) {
  const supabase = await createClient();
  const payload = {
    company_id: data.companyId,
    period_label: data.periodLabel,
    opportunity_id: data.opportunityId ?? null,
    content: { summary: data.summary },
    status: data.submit ? "submitted" : "draft",
    submitted_at: data.submit ? new Date().toISOString() : null,
  };

  if (data.id) {
    const { error } = await supabase.from("issuer_reports").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
    await logAudit({
      entityType: "issuer_report",
      entityId: data.id,
      action: data.submit ? "report_submitted" : "report_updated",
    });
  } else {
    const { data: created, error } = await supabase
      .from("issuer_reports")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: error.message };
    await logAudit({
      entityType: "issuer_report",
      entityId: created.id,
      action: data.submit ? "report_submitted" : "report_created",
    });
  }

  revalidatePath("/business/issuer-reporting");
  revalidatePath("/admin/reports");
  return { success: true };
}

export async function adminPublishIssuerReport(reportId: string) {
  const supabase = await createClient();
  const { data: report } = await supabase
    .from("issuer_reports")
    .select("id, period_label, opportunity_id")
    .eq("id", reportId)
    .maybeSingle();

  const { error } = await supabase
    .from("issuer_reports")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  if (error) return { error: error.message };

  if (report?.opportunity_id) {
    const { data: positions } = await supabase
      .from("portfolio_positions")
      .select("investor_profiles(user_id)")
      .eq("opportunity_id", report.opportunity_id);

    for (const pos of positions ?? []) {
      const investor = pos.investor_profiles as { user_id?: string } | null;
      if (investor?.user_id) {
        await notifyUser(
          investor.user_id,
          "New issuer report",
          `${report.period_label} update is now available.`,
          "/investor/reports",
        );
      }
    }
  }

  await logAudit({
    entityType: "issuer_report",
    entityId: reportId,
    action: "report_published",
  });

  revalidatePath("/admin/reports");
  revalidatePath("/investor/reports");
  return { success: true };
}

export async function reviewDocument(documentId: string, approve: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const status = approve ? "approved" : "rejected";
  const { data: doc, error } = await supabase
    .from("documents")
    .update({
      status,
      reviewed_by: user?.id,
    })
    .eq("id", documentId)
    .select("uploaded_by, file_name")
    .single();

  if (error) return { error: error.message };

  if (doc?.uploaded_by) {
    await notifyUser(
      doc.uploaded_by,
      approve ? "Document approved" : "Document rejected",
      `Your document "${doc.file_name}" has been ${status}.`,
      "/investor/documents",
    );
  }

  await logAudit({
    entityType: "document",
    entityId: documentId,
    action: approve ? "document_approved" : "document_rejected",
  });

  revalidatePath("/admin/documents");
  return { success: true };
}

export async function updatePlatformFxRate(kesPerUsd: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("platform_settings")
    .update({ value: { kes_per_usd: kesPerUsd } })
    .eq("key", "fx_rates");

  if (error) return { error: error.message };

  await logAudit({
    entityType: "platform_settings",
    action: "fx_rate_updated",
    newState: { kes_per_usd: kesPerUsd },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
