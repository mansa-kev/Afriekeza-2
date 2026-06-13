import Link from "next/link";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listInvestorsForAdmin } from "@/lib/supabase/queries";

type InvestorRow = {
  id: string;
  email: string;
  classification: string;
  kyc: string;
  suitability: string;
  created: string;
};

export default async function AdminInvestorsPage() {
  const { data: investors } = await listInvestorsForAdmin();

  const rows: InvestorRow[] = investors.map((inv) => {
    const profile = inv.profiles as { email?: string; full_name?: string } | null;
    return {
      id: inv.id,
      email: profile?.full_name ?? profile?.email ?? inv.user_id,
      classification: inv.classification ?? "—",
      kyc: String(inv.kyc_status).replace(/_/g, " "),
      suitability: String(inv.suitability_status).replace(/_/g, " "),
      created: new Date(inv.created_at).toLocaleDateString(),
    };
  });

  return (
    <div>
      <PortalPageHeader
        title="Investors"
        description="KYC, suitability, restrictions, and investor activity."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No investors"
          description="Investor records will appear after onboarding and profile creation."
        />
      ) : (
        <PortalDataTable<InvestorRow>
          rows={rows}
          rowKey={(r) => r.id}
          dense
          columns={[
            {
              key: "email",
              header: "Investor",
              render: (r) => (
                <Link
                  href={`/admin/investors/${r.id}`}
                  className="font-medium text-blue hover:underline"
                >
                  {r.email}
                </Link>
              ),
            },
            {
              key: "classification",
              header: "Classification",
              render: (r) => (
                <span className="capitalize text-muted">{r.classification}</span>
              ),
            },
            {
              key: "kyc",
              header: "KYC",
              render: (r) => <StatusPill status={r.kyc} />,
            },
            {
              key: "suitability",
              header: "Suitability",
              render: (r) => <StatusPill status={r.suitability} />,
            },
            {
              key: "created",
              header: "Created",
              render: (r) => <span className="text-muted">{r.created}</span>,
            },
            {
              key: "action",
              header: "",
              className: "text-right",
              render: (r) => (
                <Link
                  href={`/admin/investors/${r.id}`}
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
