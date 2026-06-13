import Link from "next/link";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";
import { RegistryAdminReviewPanel } from "@/components/registry/registry-admin-review";
import {
  listRegistryReviewQueue,
  listSubmittedReadinessItems,
} from "@/lib/registry/queries";
import { formatReadinessLabel } from "@/lib/registry/score";

type QueueRow = {
  id: string;
  company: string;
  kyb: string;
  score: string;
  status: string;
  pending: number;
};

export default async function AdminRegistryPage() {
  const [queue, submittedItems] = await Promise.all([
    listRegistryReviewQueue(),
    listSubmittedReadinessItems(),
  ]);

  const companyStatuses = queue.map((c) => ({
    id: c.id,
    legal_name: c.legal_name,
    funding_readiness_status: c.funding_readiness_status ?? "not_started",
  }));

  const normalizedSubmitted = submittedItems.map((item) => {
    const company = Array.isArray(item.companies)
      ? item.companies[0]
      : item.companies;
    return {
      id: item.id,
      company_id: item.company_id,
      category: item.category,
      title: item.title,
      status: item.status,
      companies: company ?? null,
    };
  });

  const pendingQueue = queue.filter((c) => c.pendingItems > 0);

  const rows: QueueRow[] = queue.map((c) => ({
    id: c.id,
    company: c.legal_name,
    kyb: String(c.kyb_status ?? "pending").replaceAll("_", " "),
    score: c.funding_readiness_score != null ? `${c.funding_readiness_score}%` : "—",
    status: formatReadinessLabel(c.funding_readiness_status ?? "not_started"),
    pending: c.pendingItems,
  }));

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Registry review"
        description="Funding readiness queue, checklist approvals, and company status."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <PortalCard padding="sm">
          <p className="text-sm text-muted">Companies on Registry</p>
          <p className="text-2xl font-bold text-navy">{queue.length}</p>
        </PortalCard>
        <PortalCard padding="sm">
          <p className="text-sm text-muted">Pending submissions</p>
          <p className="text-2xl font-bold text-navy">{submittedItems.length}</p>
        </PortalCard>
        <PortalCard padding="sm">
          <p className="text-sm text-muted">Awaiting review</p>
          <p className="text-2xl font-bold text-navy">{pendingQueue.length}</p>
        </PortalCard>
      </div>

      <PortalSection title="Review queue">
        <PortalDataTable<QueueRow>
          rows={rows}
          rowKey={(r) => r.id}
          dense
          emptyMessage="No registry companies yet."
          columns={[
            {
              key: "company",
              header: "Company",
              render: (r) => (
                <Link
                  href={`/admin/businesses/${r.id}`}
                  className="font-medium text-blue hover:underline"
                >
                  {r.company}
                </Link>
              ),
            },
            {
              key: "kyb",
              header: "KYB",
              render: (r) => <StatusPill status={r.kyb} />,
            },
            {
              key: "score",
              header: "Score",
              render: (r) => <span className="tabular-nums">{r.score}</span>,
            },
            {
              key: "status",
              header: "Readiness",
              render: (r) => <span className="capitalize text-muted">{r.status}</span>,
            },
            {
              key: "pending",
              header: "Pending",
              render: (r) => <span className="tabular-nums">{r.pending}</span>,
            },
            {
              key: "action",
              header: "",
              className: "text-right",
              render: (r) => (
                <Link
                  href={`/admin/businesses/${r.id}`}
                  className="text-sm font-medium text-blue hover:underline"
                >
                  View issuer
                </Link>
              ),
            },
          ]}
        />
      </PortalSection>

      <PortalSection title="Checklist review">
        <RegistryAdminReviewPanel
          submittedItems={normalizedSubmitted}
          companyStatuses={companyStatuses}
        />
      </PortalSection>
    </div>
  );
}
