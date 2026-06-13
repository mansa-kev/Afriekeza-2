import { EmptyState } from "@/components/portal/empty-state";
import { PortalDataTable } from "@/components/portal/portal-data-table";
import { PortalPageHeader } from "@/components/portal/page-header";
import { listAuditEvents } from "@/lib/supabase/queries";

type AuditRow = {
  id: string;
  time: string;
  action: string;
  entity: string;
  actor: string;
  note: string;
};

export default async function AuditLogsPage() {
  const { data: events } = await listAuditEvents(100);

  const rows: AuditRow[] = events.map((e) => ({
    id: e.id,
    time: new Date(e.created_at).toLocaleString(),
    action: e.action,
    entity: e.entity_type,
    actor: e.actor_id ?? "—",
    note: e.note ?? "—",
  }));

  return (
    <div>
      <PortalPageHeader
        title="Audit logs"
        description="Append-only record of sensitive platform actions."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No audit events"
          description="Critical actions will be logged here automatically."
        />
      ) : (
        <PortalDataTable<AuditRow>
          title="Activity feed"
          rows={rows}
          rowKey={(r) => r.id}
          dense
          columns={[
            { key: "time", header: "Time", render: (r) => <span className="text-muted">{r.time}</span> },
            { key: "action", header: "Action", render: (r) => <span className="font-medium">{r.action}</span> },
            { key: "entity", header: "Entity", render: (r) => r.entity },
            { key: "actor", header: "Actor", render: (r) => <span className="font-mono text-xs text-muted">{r.actor}</span> },
            { key: "note", header: "Note", render: (r) => <span className="text-muted">{r.note}</span> },
          ]}
        />
      )}
    </div>
  );
}
