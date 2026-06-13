import { PortalPageHeader } from "@/components/portal/page-header";
import { UseOfFundsManager } from "@/components/business/use-of-funds-manager";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { getRegistryCompanyContext } from "@/lib/registry/queries";
import { listUseOfFundsForCompany } from "@/lib/supabase/queries";

export default async function RegistryUseOfFundsPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const companyId = membership?.company_id;
  const { data: items } = companyId
    ? await listUseOfFundsForCompany(companyId)
    : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Use of funds"
        description="Capital deployment plan, evidence uploads, and variance tracking."
      />
      {companyId ? (
        <UseOfFundsManager companyId={companyId} items={items ?? []} />
      ) : (
        <p className="text-sm text-muted">
          Complete your company profile before tracking use of funds.
        </p>
      )}
    </div>
  );
}
