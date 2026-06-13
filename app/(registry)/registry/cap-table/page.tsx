import { PortalPageHeader } from "@/components/portal/page-header";
import { RegistryManager } from "@/components/business/registry-manager";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { getRegistryCompanyContext } from "@/lib/registry/queries";
import {
  listCapTableForCompany,
  listEsopPoolsForCompany,
} from "@/lib/supabase/queries";

export default async function RegistryCapTablePage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
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
        title="Cap table"
        description="Shareholders, share classes, ownership percentages, and ESOP pools."
      />
      {companyId ? (
        <RegistryManager
          companyId={companyId}
          capTable={capTable ?? []}
          esopPools={esopPools ?? []}
        />
      ) : (
        <p className="text-sm text-muted">
          Complete your company profile before building your cap table.
        </p>
      )}
    </div>
  );
}
