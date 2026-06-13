import { ReportPublishAction } from "@/components/admin/operational-actions";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listIssuerReportsForAdmin } from "@/lib/supabase/queries";

export default async function AdminReportsPage() {
  const { data: reports } = await listIssuerReportsForAdmin();

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Reporting status"
        description="Issuer reports, publication approval, and material events."
      />

      {(reports ?? []).length === 0 ? (
        <EmptyState
          title="No reports pending review"
          description="Submitted issuer reports will queue here for approval."
        />
      ) : (
        <div className="grid gap-4">
          {(reports ?? []).map((r) => {
            const company = r.companies as { legal_name?: string } | null;
            const content = r.content as { summary?: string };
            return (
              <PortalCard key={r.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark">{r.period_label}</p>
                    <p className="mt-1 text-sm text-muted">{company?.legal_name ?? "Issuer"}</p>
                  </div>
                  <StatusPill status={String(r.status).replaceAll("_", " ")} />
                </div>
                <p className="mt-3 text-sm text-muted">{content?.summary ?? "—"}</p>
                {r.status === "submitted" ? <ReportPublishAction reportId={r.id} /> : null}
              </PortalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
