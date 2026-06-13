"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  ensureRegistryWorkspace,
  recalculateAndPersistScore,
} from "@/lib/registry/queries";

const REGISTRY_PATHS = [
  "/registry/dashboard",
  "/registry/readiness",
  "/admin/registry",
];

function revalidateRegistry() {
  for (const p of REGISTRY_PATHS) revalidatePath(p);
}

async function logAudit(
  entityType: string,
  entityId: string,
  action: string,
  note?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.rpc("log_audit_event", {
    p_actor_id: user.id,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_action: action,
    p_previous_state: null,
    p_new_state: null,
    p_note: note ?? null,
  });
}

export async function bootstrapRegistryForCompany(companyId: string) {
  await ensureRegistryWorkspace(companyId);
  await recalculateAndPersistScore(companyId);
  revalidateRegistry();
}

export async function updateReadinessItemStatus(
  itemId: string,
  status: string,
  companyId: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("readiness_items")
    .update({ status })
    .eq("id", itemId)
    .eq("company_id", companyId);

  if (error) return { error: error.message };

  await recalculateAndPersistScore(companyId);
  await logAudit("readiness_item", itemId, `status_${status}`);
  revalidateRegistry();
  return { success: true };
}

export async function submitReadinessItem(itemId: string, companyId: string) {
  return updateReadinessItemStatus(itemId, "submitted", companyId);
}

export async function reviewReadinessItem(data: {
  itemId: string;
  companyId: string;
  decision: "approved" | "rejected" | "needs_correction";
  notes?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const status =
    data.decision === "approved"
      ? "approved"
      : data.decision === "rejected"
        ? "rejected"
        : "needs_correction";

  await supabase
    .from("readiness_items")
    .update({
      status,
      admin_notes: data.notes ?? null,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", data.itemId);

  await supabase.from("registry_admin_reviews").insert({
    company_id: data.companyId,
    entity_type: "readiness_item",
    entity_id: data.itemId,
    reviewer_id: user?.id ?? null,
    decision: data.decision,
    notes: data.notes ?? null,
    visible_to_company: true,
  });

  await recalculateAndPersistScore(data.companyId);
  await logAudit("readiness_item", data.itemId, `admin_${data.decision}`, data.notes);
  revalidateRegistry();
  return { success: true };
}

export async function setCompanyRegistryStatus(
  companyId: string,
  status: string,
  notes?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("companies")
    .update({ funding_readiness_status: status })
    .eq("id", companyId);

  await supabase.from("registry_admin_reviews").insert({
    company_id: companyId,
    entity_type: "company",
    entity_id: companyId,
    reviewer_id: user?.id ?? null,
    decision: status,
    notes: notes ?? null,
    visible_to_company: true,
  });

  await logAudit("company", companyId, `registry_status_${status}`, notes);
  revalidateRegistry();
  return { success: true };
}

export async function recalculateRegistryScore(companyId: string) {
  await recalculateAndPersistScore(companyId);
  revalidateRegistry();
  return { success: true };
}
