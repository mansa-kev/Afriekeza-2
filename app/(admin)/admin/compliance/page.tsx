import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { listAuditEvents, listInvestorsForAdmin, listPaymentIntents } from "@/lib/supabase/queries";

export default async function AdminCompliancePage() {
  const [{ data: audits }, { data: investors }, { data: payments }] = await Promise.all([
    listAuditEvents(200),
    listInvestorsForAdmin(),
    listPaymentIntents(200),
  ]);

  const auditCsv = [
    "id,action,entity_type,entity_id,created_at",
    ...(audits ?? []).map((a) =>
      [a.id, a.action, a.entity_type, a.entity_id ?? "", a.created_at].join(","),
    ),
  ].join("\n");

  const investorCsv = [
    "id,email,full_name,kyc_status,suitability_status",
    ...(investors ?? []).map((i) => {
      const p = i.profiles as { email?: string; full_name?: string } | null;
      return [i.id, p?.email ?? "", p?.full_name ?? "", i.kyc_status, i.suitability_status].join(",");
    }),
  ].join("\n");

  const paymentCsv = [
    "id,provider,purpose,amount_kes,status,external_id,created_at",
    ...(payments ?? []).map((p) =>
      [p.id, p.provider, p.purpose, p.amount_kes, p.status, p.external_id ?? "", p.created_at].join(","),
    ),
  ].join("\n");

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Risk & compliance"
        description="Regulator-ready CSV exports for audit, KYC, and payment activity."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <ExportCard title="Audit log" filename="afriekeza-audit.csv" content={auditCsv} />
        <ExportCard title="Investor KYC" filename="afriekeza-investors.csv" content={investorCsv} />
        <ExportCard title="Payment intents" filename="afriekeza-payments.csv" content={paymentCsv} />
      </div>
    </div>
  );
}

function ExportCard({
  title,
  filename,
  content,
}: {
  title: string;
  filename: string;
  content: string;
}) {
  return (
    <PortalCard>
      <h2 className="font-semibold text-dark">{title}</h2>
      <p className="mt-1 text-sm text-muted">{content.split("\n").length - 1} records</p>
      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(content)}`}
        download={filename}
        className="mt-4 inline-block rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue/90"
      >
        Download CSV
      </a>
    </PortalCard>
  );
}
