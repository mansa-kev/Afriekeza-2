import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getRegistryDashboardSummary,
  listReadinessItems,
} from "@/lib/registry/queries";
import { recalculateAndPersistScore } from "@/lib/registry/queries";
import { updateReadinessItemStatus } from "@/lib/actions/registry";

const ADMIN_ROLES = new Set([
  "admin",
  "super_admin",
  "compliance_officer",
  "issuer_analyst",
  "operations_manager",
]);

async function authorizeRegistryAccess(companyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("portal_roles")
    .eq("id", user.id)
    .maybeSingle();

  const roles = profile?.portal_roles ?? [];
  const isAdmin = roles.some((r: string) => ADMIN_ROLES.has(r));

  if (isAdmin) return { user, isAdmin: true };

  const { data: membership } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .maybeSingle();

  if (!membership) return { error: "Forbidden", status: 403 as const };
  return { user, isAdmin: false };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: companyId } = await params;
  const auth = await authorizeRegistryAccess(companyId);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const [items, summary] = await Promise.all([
    listReadinessItems(companyId),
    getRegistryDashboardSummary(companyId),
  ]);

  return NextResponse.json({
    organizationId: companyId,
    readiness: {
      score: summary.score,
      items,
      documentCount: summary.documentCount,
      capTableCount: summary.capTableCount,
      reportCount: summary.reportCount,
      pendingTasks: summary.pendingTasks,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: companyId } = await params;
  const auth = await authorizeRegistryAccess(companyId);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = (await request.json()) as {
    itemId?: string;
    status?: string;
    recalculate?: boolean;
  };

  if (body.recalculate) {
    const score = await recalculateAndPersistScore(companyId);
    return NextResponse.json({ score });
  }

  if (body.itemId && body.status) {
    const result = await updateReadinessItemStatus(
      body.itemId,
      body.status,
      companyId,
    );
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Provide itemId + status or recalculate: true" },
    { status: 400 },
  );
}
