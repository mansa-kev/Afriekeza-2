import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listOpportunities } from "@/lib/supabase/queries";

type OpportunityRow = {
  id: string;
  title: string;
  instrument: string;
  status: string;
  slug: string;
};

export default async function OpportunityBuilderPage() {
  const { data: opportunities } = await listOpportunities();

  const rows: OpportunityRow[] = opportunities.map((o) => ({
    id: o.id,
    title: o.title,
    instrument: o.instrument ?? "—",
    status: String(o.status).replace(/_/g, " "),
    slug: o.slug,
  }));

  return (
    <div>
      <PortalPageHeader
        title="Opportunity review"
        description="Create, configure, and publish structured opportunities."
        action={
          <Button href="/admin/opportunity-builder/new" variant="primary" size="sm">
            New draft
          </Button>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No opportunities"
          description="Create a draft from an approved raise application."
        />
      ) : (
        <PortalDataTable<OpportunityRow>
          rows={rows}
          rowKey={(r) => r.id}
          dense
          columns={[
            {
              key: "title",
              header: "Deal",
              render: (r) => (
                <Link
                  href={`/admin/opportunity-builder/${r.id}`}
                  className="font-medium text-blue hover:underline"
                >
                  {r.title}
                </Link>
              ),
            },
            {
              key: "instrument",
              header: "Instrument",
              render: (r) => <span className="text-muted">{r.instrument}</span>,
            },
            {
              key: "status",
              header: "Stage",
              render: (r) => <StatusPill status={r.status} />,
            },
            {
              key: "action",
              header: "",
              className: "text-right",
              render: (r) => (
                <Link
                  href={`/admin/opportunity-builder/${r.id}`}
                  className="text-sm font-medium text-blue hover:underline"
                >
                  Edit
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
