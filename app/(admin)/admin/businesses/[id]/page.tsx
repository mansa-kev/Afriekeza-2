import { BusinessReviewActions } from "@/components/admin/review-actions";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();

  if (!company) return <p className="text-muted">Business not found.</p>;

  return (
    <div>
      <PortalPageHeader title={company.legal_name} description="KYB, funding readiness, documents, application." />
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-header-border bg-white p-4"><h2 className="text-sm font-semibold">KYB</h2><StatusPill status={String(company.kyb_status).replace(/_/g, " ")} /><BusinessReviewActions companyId={company.id} /></section>
        <section className="rounded-xl border border-header-border bg-white p-4"><h2 className="text-sm font-semibold">Status</h2><StatusPill status={String(company.status).replace(/_/g, " ")} /></section>
        <section className="rounded-xl border border-header-border bg-white p-4"><h2 className="text-sm font-semibold">Readiness</h2><p className="mt-2 text-sm text-muted">{company.funding_readiness_status}</p></section>
      </div>
    </div>
  );
}
