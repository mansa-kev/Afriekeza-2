import { PortalPageHeader } from "@/components/portal/page-header";
import { OpportunityForm } from "@/components/admin/opportunity-form";
import { listCompaniesForAdmin } from "@/lib/supabase/queries";

export default async function OpportunityBuilderNewPage() {
  const { data: companies } = await listCompaniesForAdmin();

  return (
    <div className="max-w-3xl">
      <PortalPageHeader title="New opportunity draft" description="Configure terms, documents, risk label, and lifecycle." />
      <section className="rounded-xl border border-header-border bg-white p-6">
        <OpportunityForm companies={companies ?? []} />
      </section>
    </div>
  );
}
