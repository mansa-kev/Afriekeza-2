import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";
import { IssuerReportingManager } from "@/components/business/issuer-reporting-manager";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { getRegistryCompanyContext, listReportingTasks } from "@/lib/registry/queries";
import { listIssuerReportsForCompany } from "@/lib/supabase/queries";

export default async function RegistryReportingPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const companyId = membership?.company_id;
  const { data: reports } = companyId
    ? await listIssuerReportsForCompany(companyId)
    : { data: [] };
  const tasks = companyId ? await listReportingTasks(companyId) : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Investor reporting"
        description="Update templates, submission workflow, and reporting calendar."
      />

      <PortalSection title="Reporting calendar">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted">No reporting tasks scheduled.</p>
        ) : (
          <div className="grid gap-3">
            {tasks.map((t) => (
              <PortalCard key={t.id} padding="sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-dark">{t.title}</p>
                    <p className="text-sm text-muted">Due {t.due_date}</p>
                  </div>
                  <StatusPill status={t.status} />
                </div>
              </PortalCard>
            ))}
          </div>
        )}
      </PortalSection>

      {companyId ? (
        <IssuerReportingManager companyId={companyId} reports={reports ?? []} />
      ) : (
        <p className="text-sm text-muted">
          Complete your company profile before drafting reports.
        </p>
      )}
    </div>
  );
}
