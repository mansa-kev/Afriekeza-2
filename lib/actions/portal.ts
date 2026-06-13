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

export async function logAudit(payload: AuditPayload) {
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

export async function saveInvestorOnboardingStep(data: {
  step: number;
  fullName?: string;
  phone?: string;
  employmentStatus?: string;
  sourceOfFunds?: string;
  investmentExperience?: string;
  investmentGoals?: string;
  expectedTicketSizeKes?: number;
  liquidityNeed?: string;
  classification?: string;
  suitabilityAnswers?: Record<string, string>;
  riskAcknowledgements?: string[];
  termsAccepted?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  if (data.fullName || data.phone) {
    await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        phone: data.phone,
        portal_roles: ["investor"],
        account_status: "active",
      })
      .eq("id", user.id);
  }

  const { data: existing } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let investorId = existing?.id;

  const profilePayload: Record<string, unknown> = {
    onboarding_step: data.step,
    employment_status: data.employmentStatus,
    source_of_funds: data.sourceOfFunds,
    investment_experience: data.investmentExperience,
    investment_goals: data.investmentGoals,
    expected_ticket_size_kes: data.expectedTicketSizeKes,
    liquidity_need: data.liquidityNeed,
    kyc_status: data.step >= 2 ? "submitted" : "in_progress",
    suitability_status: data.step >= 4 ? "submitted" : "in_progress",
  };

  if (data.classification) {
    profilePayload.classification = data.classification;
  }
  if (data.termsAccepted) {
    profilePayload.terms_accepted_at = new Date().toISOString();
    profilePayload.kyc_status = "submitted";
    profilePayload.suitability_status = "submitted";
  }

  if (investorId) {
    await supabase.from("investor_profiles").update(profilePayload).eq("id", investorId);
  } else {
    const { data: created, error } = await supabase
      .from("investor_profiles")
      .insert({ user_id: user.id, ...profilePayload })
      .select("id")
      .single();
    if (error) return { error: error.message };
    investorId = created.id;
  }

  if (investorId && data.suitabilityAnswers) {
    for (const [questionKey, responseValue] of Object.entries(data.suitabilityAnswers)) {
      await supabase.from("suitability_responses").upsert(
        { investor_id: investorId, question_key: questionKey, response_value: responseValue },
        { onConflict: "investor_id,question_key", ignoreDuplicates: false },
      );
    }
  }

  if (investorId && data.riskAcknowledgements?.length) {
    for (const key of data.riskAcknowledgements) {
      await supabase.from("risk_acknowledgements").upsert(
        { investor_id: investorId, acknowledgement_key: key },
        { onConflict: "investor_id,acknowledgement_key", ignoreDuplicates: true },
      );
    }
  }

  await logAudit({
    entityType: "investor_profile",
    entityId: investorId,
    action: "onboarding_step_saved",
    newState: { step: data.step },
  });

  revalidatePath("/investor/dashboard");
  revalidatePath("/investor/onboarding");
  return { success: true, investorId };
}

export async function saveCompanyProfile(data: {
  legalName: string;
  tradingName?: string;
  registrationNumber?: string;
  sector?: string;
  entityType?: string;
  registeredAddress?: string;
  revenueModel?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: membership } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const payload = {
    legal_name: data.legalName,
    trading_name: data.tradingName,
    registration_number: data.registrationNumber,
    sector: data.sector,
    entity_type: data.entityType,
    registered_address: data.registeredAddress,
    revenue_model: data.revenueModel,
  };

  if (membership?.company_id) {
    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", membership.company_id);
    if (error) return { error: error.message };
    await logAudit({
      entityType: "company",
      entityId: membership.company_id,
      action: "company_updated",
      newState: payload,
    });
    revalidatePath("/business/company");
    return { success: true, companyId: membership.company_id };
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert(payload)
    .select("id")
    .single();
  if (companyError) return { error: companyError.message };

  await supabase.from("company_users").insert({
    company_id: company.id,
    user_id: user.id,
    role: "owner",
    invitation_status: "accepted",
  });

  await supabase
    .from("profiles")
    .update({ portal_roles: ["business_user"] })
    .eq("id", user.id);

  await logAudit({
    entityType: "company",
    entityId: company.id,
    action: "company_created",
    newState: payload,
  });

  revalidatePath("/business/company");
  revalidatePath("/business/dashboard");
  return { success: true, companyId: company.id };
}

export async function saveRaiseApplication(data: {
  instrument: string;
  amountRequestedKes: number;
  preferredTenorMonths?: number;
  useOfFunds?: unknown[];
  targetTimeline?: string;
  repaymentNotes?: string;
  submit?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: membership } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership?.company_id) return { error: "No company linked to your account" };

  const { data: existing } = await supabase
    .from("raise_applications")
    .select("id, status")
    .eq("company_id", membership.company_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    company_id: membership.company_id,
    instrument: data.instrument,
    amount_requested_kes: data.amountRequestedKes,
    preferred_tenor_months: data.preferredTenorMonths,
    use_of_funds: data.useOfFunds ?? [],
    target_timeline: data.targetTimeline,
    repayment_notes: data.repaymentNotes,
    status: data.submit ? "submitted" : "draft",
    submitted_at: data.submit ? new Date().toISOString() : null,
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("raise_applications")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
    await logAudit({
      entityType: "raise_application",
      entityId: existing.id,
      action: data.submit ? "application_submitted" : "application_updated",
      newState: payload,
    });
    revalidatePath("/business/raise-application");
    return { success: true, id: existing.id };
  }

  const { data: created, error } = await supabase
    .from("raise_applications")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };

  await logAudit({
    entityType: "raise_application",
    entityId: created.id,
    action: data.submit ? "application_submitted" : "application_created",
    newState: payload,
  });

  revalidatePath("/business/raise-application");
  return { success: true, id: created.id };
}

export async function saveOpportunity(data: {
  id?: string;
  companyId: string;
  slug: string;
  title: string;
  instrument: string;
  targetRaiseKes: number;
  minimumInvestmentKes: number;
  tenorMonths?: number;
  targetReturnPct?: number;
  repaymentFrequency?: string;
  riskLabel?: string;
  suitabilityLevel?: string;
  sector?: string;
  location?: string;
  plainSummary?: string;
  whatYouOwn?: string;
  status?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const payload = {
    company_id: data.companyId,
    slug: data.slug,
    title: data.title,
    instrument: data.instrument,
    target_raise_kes: data.targetRaiseKes,
    minimum_investment_kes: data.minimumInvestmentKes,
    tenor_months: data.tenorMonths,
    target_return_pct: data.targetReturnPct,
    repayment_frequency: data.repaymentFrequency,
    risk_label: data.riskLabel,
    suitability_level: data.suitabilityLevel,
    sector: data.sector,
    location: data.location,
    plain_summary: data.plainSummary,
    what_you_own: data.whatYouOwn,
    status: data.status ?? "draft",
  };

  if (data.id) {
    const { error } = await supabase.from("opportunities").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
    await logAudit({
      entityType: "opportunity",
      entityId: data.id,
      action: "opportunity_updated",
      newState: payload,
    });
    revalidatePath("/admin/opportunity-builder");
    return { success: true, id: data.id };
  }

  const { data: created, error } = await supabase
    .from("opportunities")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: error.message };

  await logAudit({
    entityType: "opportunity",
    entityId: created.id,
    action: "opportunity_created",
    newState: payload,
  });

  revalidatePath("/admin/opportunity-builder");
  return { success: true, id: created.id };
}

export async function uploadDocument(data: {
  ownerType: "investor" | "company";
  ownerId: string;
  category: string;
  fileName: string;
  storagePath: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: doc, error } = await supabase
    .from("documents")
    .insert({
      owner_type: data.ownerType,
      owner_id: data.ownerId,
      category: data.category,
      file_name: data.fileName,
      storage_path: data.storagePath,
      status: "uploaded",
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit({
    entityType: "document",
    entityId: doc.id,
    action: "document_uploaded",
    newState: { category: data.category, fileName: data.fileName },
  });

  return { success: true, id: doc.id };
}

export async function reviewInvestorKyc(investorId: string, approve: boolean) {
  const supabase = await createClient();
  const status = approve ? "approved" : "rejected";
  const { error } = await supabase
    .from("investor_profiles")
    .update({ kyc_status: status, suitability_status: approve ? "approved" : "rejected" })
    .eq("id", investorId);
  if (error) return { error: error.message };

  await logAudit({
    entityType: "investor_profile",
    entityId: investorId,
    action: approve ? "kyc_approved" : "kyc_rejected",
    newState: { kyc_status: status },
  });

  revalidatePath("/admin/investors");
  return { success: true };
}

export async function reviewCompanyKyb(companyId: string, approve: boolean) {
  const supabase = await createClient();
  const status = approve ? "approved" : "rejected";
  const { error } = await supabase
    .from("companies")
    .update({ kyb_status: status })
    .eq("id", companyId);
  if (error) return { error: error.message };

  await logAudit({
    entityType: "company",
    entityId: companyId,
    action: approve ? "kyb_approved" : "kyb_rejected",
    newState: { kyb_status: status },
  });

  revalidatePath("/admin/businesses");
  return { success: true };
}

export async function createCommitment(data: {
  opportunityId: string;
  amountKes: number;
  acknowledgementComplete: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id, kyc_status, suitability_status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!investor) return { error: "Investor profile not found" };

  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("id, status, minimum_investment_kes, title")
    .eq("id", data.opportunityId)
    .maybeSingle();
  if (!opportunity) return { error: "Opportunity not found" };

  const { checkInvestorEligibility } = await import("@/lib/investor/eligibility");
  const eligibility = checkInvestorEligibility(investor, opportunity, data.amountKes);
  if (!eligibility.canCommit) {
    return { error: eligibility.reasons.join(" ") };
  }

  if (!data.acknowledgementComplete) {
    return { error: "Risk acknowledgement is required." };
  }

  const { data: existing } = await supabase
    .from("commitments")
    .select("id")
    .eq("investor_id", investor.id)
    .eq("opportunity_id", data.opportunityId)
    .in("status", ["draft", "pending_acknowledgement", "pending_payment", "paid", "allocated"])
    .maybeSingle();

  if (existing) {
    return { error: "You already have an active commitment for this opportunity." };
  }

  const { data: commitment, error } = await supabase
    .from("commitments")
    .insert({
      investor_id: investor.id,
      opportunity_id: data.opportunityId,
      amount_kes: data.amountKes,
      status: "pending_payment",
      acknowledgement_complete: true,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit({
    entityType: "commitment",
    entityId: commitment.id,
    action: "commitment_created",
    newState: { amount_kes: data.amountKes, opportunity_id: data.opportunityId },
  });

  revalidatePath("/investor/portfolio");
  revalidatePath("/admin/allocations");
  return { success: true, id: commitment.id };
}

export async function allocateCommitment(commitmentId: string) {
  const supabase = await createClient();
  const { data: commitment, error: fetchError } = await supabase
    .from("commitments")
    .select("id, investor_id, opportunity_id, amount_kes, status")
    .eq("id", commitmentId)
    .maybeSingle();

  if (fetchError || !commitment) return { error: "Commitment not found" };
  if (commitment.status === "allocated") return { error: "Already allocated" };
  if (!["pending_payment", "paid"].includes(commitment.status)) {
    return { error: "Commitment is not ready for allocation" };
  }

  const { data: position, error: positionError } = await supabase
    .from("portfolio_positions")
    .insert({
      investor_id: commitment.investor_id,
      opportunity_id: commitment.opportunity_id,
      commitment_id: commitment.id,
      principal_kes: commitment.amount_kes,
      status: "active",
      allocated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (positionError) return { error: positionError.message };

  const { error: updateError } = await supabase
    .from("commitments")
    .update({
      status: "allocated",
      allocated_at: new Date().toISOString(),
    })
    .eq("id", commitmentId);

  if (updateError) return { error: updateError.message };

  const { data: opp } = await supabase
    .from("opportunities")
    .select("tenor_months")
    .eq("id", commitment.opportunity_id)
    .maybeSingle();

  if (opp?.tenor_months) {
    const { createRepaymentSchedule } = await import("@/lib/actions/operational");
    await createRepaymentSchedule(position.id, opp.tenor_months);
  }

  const { data: investorRow } = await supabase
    .from("investor_profiles")
    .select("user_id")
    .eq("id", commitment.investor_id)
    .maybeSingle();

  if (investorRow?.user_id) {
    const { notifyUser } = await import("@/lib/actions/operational");
    await notifyUser(
      investorRow.user_id,
      "Allocation confirmed",
      "Your investment has been allocated. View your portfolio for details.",
      "/investor/portfolio",
    );
  }

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_allocated",
    newState: { position_id: position.id },
  });

  revalidatePath("/admin/allocations");
  revalidatePath("/investor/portfolio");
  return { success: true, positionId: position.id };
}

export async function cancelCommitment(commitmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("commitments")
    .update({ status: "cancelled" })
    .eq("id", commitmentId);

  if (error) return { error: error.message };

  await logAudit({
    entityType: "commitment",
    entityId: commitmentId,
    action: "commitment_cancelled",
  });

  revalidatePath("/admin/allocations");
  return { success: true };
}

export async function createSupportTicket(data: {
  portal: string;
  category: string;
  subject: string;
  body: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: user.id,
      portal: data.portal,
      category: data.category,
      subject: data.subject,
      body: data.body,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logAudit({
    entityType: "support_ticket",
    entityId: ticket.id,
    action: "ticket_created",
    newState: { subject: data.subject, category: data.category },
  });

  revalidatePath(`/${data.portal}/support`);
  revalidatePath("/admin/support");
  return { success: true, id: ticket.id };
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed",
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId);

  if (error) return { error: error.message };

  await logAudit({
    entityType: "support_ticket",
    entityId: ticketId,
    action: "ticket_status_updated",
    newState: { status },
  });

  revalidatePath("/admin/support");
  return { success: true };
}

export async function ensureInvestorWallet() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: existing } = await supabase
    .from("wallet_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return { success: true, id: existing.id };

  const { data: wallet, error } = await supabase
    .from("wallet_accounts")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, id: wallet.id };
}

