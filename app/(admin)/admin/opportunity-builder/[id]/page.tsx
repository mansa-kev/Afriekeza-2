import { OpportunityForm } from "@/components/admin/opportunity-form";
import { PortalPageHeader } from "@/components/portal/page-header";
import { createClient } from "@/lib/supabase/server";
import { listCompaniesForAdmin } from "@/lib/supabase/queries";

export default async function OpportunityBuilderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: opp } = await supabase.from("opportunities").select("*").eq("id", id).maybeSingle();
  const { data: companies } = await listCompaniesForAdmin();

  return (
    <div className="max-w-3xl">
      <PortalPageHeader title={opp?.title ?? "Opportunity"} description="Edit draft terms and publication controls." />
      {opp ? (
        <section className="rounded-xl border border-header-border bg-white p-6">
          <OpportunityForm companies={companies ?? []} opportunity={opp} />
        </section>
      ) : (
        <p className="text-muted">Opportunity not found.</p>
      )}
    </div>
  );
}
