import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { getCurrentProfile, listPublishedReportsForUser } from "@/lib/supabase/queries";

export default async function ReportsPage() {
  const { user } = await getCurrentProfile();
  const { data: reports } = user ? await listPublishedReportsForUser(user.id) : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Reporting status"
        description="Issuer updates, portfolio summaries, and material notices."
      />

      {reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Published issuer reports for your portfolio will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {reports.map((r) => {
            const company = r.companies as { legal_name?: string } | null;
            const content = r.content as { summary?: string };
            return (
              <PortalCard key={r.id}>
                <p className="text-sm text-muted">
                  {company?.legal_name ?? "Issuer"} · {r.period_label}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-dark">Investor update</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{content?.summary ?? "—"}</p>
                <p className="mt-4 text-xs text-muted">
                  Published {r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}
                </p>
              </PortalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
