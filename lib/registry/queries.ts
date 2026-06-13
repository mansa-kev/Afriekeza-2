import { createClient } from "@/lib/supabase/server";
import {
  DATA_ROOM_FOLDER_TYPES,
  DEFAULT_READINESS_CHECKLIST,
} from "@/lib/registry/checklist-template";
import {
  calculateReadinessScore,
  type ReadinessItemRow,
} from "@/lib/registry/score";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getRegistryCompanyContext(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_users")
    .select("company_id, role, companies(*)")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function listReadinessItems(companyId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("readiness_items")
    .select("*")
    .eq("company_id", companyId)
    .order("category")
    .order("created_at");
  return data ?? [];
}

export async function listReportingTasks(companyId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("reporting_tasks")
    .select("*")
    .eq("company_id", companyId)
    .order("due_date");
  return data ?? [];
}

export async function listRegistryReviewsForCompany(companyId: string) {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("registry_admin_reviews")
    .select("*, profiles:reviewer_id(full_name)")
    .eq("company_id", companyId)
    .eq("visible_to_company", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function listSubmittedReadinessItems() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("readiness_items")
    .select("id, company_id, category, title, status, companies(legal_name, trading_name)")
    .in("status", ["submitted", "needs_correction"])
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function listRegistryReviewQueue() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, legal_name, kyb_status, funding_readiness_score, funding_readiness_status, status")
    .order("updated_at", { ascending: false });

  const { data: pendingItems } = await supabase
    .from("readiness_items")
    .select("company_id, status")
    .in("status", ["submitted", "in_progress"]);

  const pendingByCompany = new Map<string, number>();
  for (const row of pendingItems ?? []) {
    pendingByCompany.set(
      row.company_id,
      (pendingByCompany.get(row.company_id) ?? 0) + 1,
    );
  }

  return (companies ?? []).map((c) => ({
    ...c,
    pendingItems: pendingByCompany.get(c.id) ?? 0,
  }));
}

export async function getRegistryDashboardSummary(companyId: string) {
  const [items, documents, capTable, reports, tasks, subscription] =
    await Promise.all([
      listReadinessItems(companyId),
      listCompanyDocuments(companyId),
      listCapTableCount(companyId),
      listReportsCount(companyId),
      listReportingTasks(companyId),
      getSubscription(companyId),
    ]);

  const score = calculateReadinessScore(
    items.map((i) => ({
      id: i.id,
      category: i.category,
      title: i.title,
      weight: i.weight,
      required: i.required,
      status: i.status,
    })),
  );

  return {
    items,
    score,
    documentCount: documents.length,
    capTableCount: capTable,
    reportCount: reports,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    subscription,
  };
}

async function listCompanyDocuments(companyId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id, status")
    .eq("owner_type", "company")
    .eq("owner_id", companyId);
  return data ?? [];
}

async function listCapTableCount(companyId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("cap_table_entries")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);
  return count ?? 0;
}

async function listReportsCount(companyId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("issuer_reports")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);
  return count ?? 0;
}

async function getSubscription(companyId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("registry_subscriptions")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  return data;
}

export async function ensureRegistryWorkspace(companyId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();

  const { count: itemCount } = await supabase
    .from("readiness_items")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);

  if ((itemCount ?? 0) === 0) {
    await supabase.from("readiness_items").insert(
      DEFAULT_READINESS_CHECKLIST.map((item) => ({
        company_id: companyId,
        category: item.category,
        title: item.title,
        description: item.description,
        weight: item.weight,
        required: item.required,
        status: "not_started",
      })),
    );
  }

  const { count: folderCount } = await supabase
    .from("data_room_folders")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId);

  if ((folderCount ?? 0) === 0) {
    await supabase.from("data_room_folders").insert(
      DATA_ROOM_FOLDER_TYPES.map((f, i) => ({
        company_id: companyId,
        folder_type: f.folder_type,
        label: f.label,
        sort_order: i,
      })),
    );
  }

  const { data: sub } = await supabase
    .from("registry_subscriptions")
    .select("id")
    .eq("company_id", companyId)
    .maybeSingle();

  if (!sub) {
    await supabase.from("registry_subscriptions").insert({
      company_id: companyId,
      plan_tier: "starter",
      status: "trial",
    });
  }

  const tasks = await listReportingTasks(companyId);
  if (tasks.length === 0) {
    const due = new Date();
    due.setMonth(due.getMonth() + 1);
    await supabase.from("reporting_tasks").insert([
      {
        company_id: companyId,
        task_type: "investor_update",
        title: "Quarterly investor update",
        due_date: due.toISOString().slice(0, 10),
        status: "pending",
      },
      {
        company_id: companyId,
        task_type: "financial_statement",
        title: "Refresh financial statements",
        due_date: due.toISOString().slice(0, 10),
        status: "pending",
      },
    ]);
  }
}

export async function recalculateAndPersistScore(companyId: string) {
  const items = await listReadinessItems(companyId);
  const score = calculateReadinessScore(
    items as ReadinessItemRow[],
  );

  const supabase = await createClient();
  await supabase
    .from("companies")
    .update({
      funding_readiness_score: score.overallScore,
      funding_readiness_status: score.readinessLabel,
    })
    .eq("id", companyId);

  await supabase.from("readiness_score_snapshots").insert({
    company_id: companyId,
    overall_score: score.overallScore,
    category_scores: score.categoryScores,
    readiness_label: score.readinessLabel,
  });

  return score;
}
