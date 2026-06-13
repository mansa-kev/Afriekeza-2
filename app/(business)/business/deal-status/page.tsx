import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";

const STATES = [
  "Draft",
  "Submitted",
  "Under Review",
  "Structuring",
  "Issuer Approval",
  "Approved",
  "Listed",
  "Reporting",
];

export default function DealStatusPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PortalPageHeader
        title="Deal pipeline"
        description="Raise lifecycle from application through listing and reporting."
      />
      <div className="space-y-2">
        {STATES.map((s, i) => (
          <PortalCard
            key={s}
            padding="sm"
            className={i === 0 ? "border-blue/25 bg-soft-blue/20" : undefined}
          >
            <div className="flex items-center gap-4">
              <span className="w-6 text-sm tabular-nums text-muted">{i + 1}</span>
              <span className="flex-1 font-medium text-dark">{s}</span>
              {i === 0 && <StatusPill status="Current stage" />}
            </div>
          </PortalCard>
        ))}
      </div>
    </div>
  );
}
