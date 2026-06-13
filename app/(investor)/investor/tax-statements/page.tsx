import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { getCurrentProfile, listTaxStatementsForUser } from "@/lib/supabase/queries";

export default async function TaxStatementsPage() {
  const { user } = await getCurrentProfile();
  const { data: statements } = user ? await listTaxStatementsForUser(user.id) : { data: [] };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Tax statements"
        description="Annual summaries for your private-market income and withholding."
      />
      {(statements ?? []).length === 0 ? (
        <EmptyState
          title="No tax statements published"
          description="Statements will appear here after Afriekeza publishes them for each tax year."
        />
      ) : (
        <div className="grid gap-4">
          {(statements ?? []).map((s) => (
            <PortalCard key={s.id}>
              <p className="font-semibold text-dark">
                Tax year {s.tax_year} · {s.currency}
              </p>
              <p className="mt-2 text-sm text-muted">{s.summary ?? "Annual tax summary"}</p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted">Total income</dt>
                  <dd className="font-medium">KES {Number(s.total_income_kes).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-muted">Withholding</dt>
                  <dd className="font-medium">KES {Number(s.total_withholding_kes).toLocaleString()}</dd>
                </div>
              </dl>
            </PortalCard>
          ))}
        </div>
      )}
    </div>
  );
}
