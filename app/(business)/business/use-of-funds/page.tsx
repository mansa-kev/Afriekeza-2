import { PortalPageHeader } from "@/components/portal/page-header";
import { UseOfFundsManager } from "@/components/business/use-of-funds-manager";
import { getCurrentProfile, getCompanyForUser, listUseOfFundsForCompany } from "@/lib/supabase/queries";

export default async function UseOfFundsPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const companyId = membership?.company_id;
  const { data: items } = companyId
    ? await listUseOfFundsForCompany(companyId)
    : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Use of funds"
        description="Approved budget, deployment tracking, evidence, and variance reporting."
      />
      {companyId ? (
        <UseOfFundsManager companyId={companyId} items={items ?? []} />
      ) : (
        <p className="text-sm text-muted">
          Save your company profile before tracking use of funds.
        </p>
      )}
    </div>
  );
}
