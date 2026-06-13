import { PortalPageHeader } from "@/components/portal/page-header";
import { RegistryManager } from "@/components/business/registry-manager";
import {
  getCurrentProfile,
  getCompanyForUser,
  listCapTableForCompany,
  listEsopPoolsForCompany,
} from "@/lib/supabase/queries";

export default async function RegistryPortalPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const companyId = membership?.company_id;

  const [{ data: capTable }, { data: esopPools }] = companyId
    ? await Promise.all([
        listCapTableForCompany(companyId),
        listEsopPoolsForCompany(companyId),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Registry"
        description="Cap table, shareholders, ESOP pools, and investor records."
      />
      {companyId ? (
        <RegistryManager
          companyId={companyId}
          capTable={capTable ?? []}
          esopPools={esopPools ?? []}
        />
      ) : (
        <p className="text-sm text-muted">
          Save your company profile before building your registry.
        </p>
      )}
    </div>
  );
}
