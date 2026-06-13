import Link from "next/link";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listBusinessesForAdmin } from "@/lib/supabase/queries";

type IssuerRow = {
  id: string;
  name: string;
  sector: string;
  status: string;
  kyb: string;
  readiness: string;
};

export default async function AdminBusinessesPage() {
  const { data: businesses } = await listBusinessesForAdmin();

  const rows: IssuerRow[] = businesses.map((b) => ({
    id: b.id,
    name: b.legal_name,
    sector: b.sector ?? "—",
    status: String(b.status).replace(/_/g, " "),
    kyb: String(b.kyb_status).replace(/_/g, " "),
    readiness: b.funding_readiness_status ?? "—",
  }));

  return (
    <div>
      <PortalPageHeader
        title="Issuers"
        description="KYB verification, funding readiness, and registry status."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No issuers"
          description="Company records will appear after issuer onboarding."
        />
      ) : (
        <PortalDataTable<IssuerRow>
          rows={rows}
          rowKey={(r) => r.id}
          dense
          columns={[
            {
              key: "name",
              header: "Company",
              render: (r) => (
                <Link
                  href={`/admin/businesses/${r.id}`}
                  className="font-medium text-blue hover:underline"
                >
                  {r.name}
                </Link>
              ),
            },
            {
              key: "sector",
              header: "Sector",
              render: (r) => <span className="text-muted">{r.sector}</span>,
            },
            {
              key: "status",
              header: "Status",
              render: (r) => <StatusPill status={r.status} />,
            },
            {
              key: "kyb",
              header: "KYB",
              render: (r) => <StatusPill status={r.kyb} />,
            },
            {
              key: "readiness",
              header: "Readiness",
              render: (r) => (
                <span className="capitalize text-muted">{r.readiness}</span>
              ),
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
                  Review
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
