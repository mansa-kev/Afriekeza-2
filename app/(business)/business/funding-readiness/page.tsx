import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";

const CATEGORIES = [
  "Governance",
  "Financial records",
  "Reporting readiness",
  "Documentation",
  "Investor suitability",
];

export default function FundingReadinessPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Readiness score"
        description="Capital readiness checklist, gaps, and recommended next steps."
      />
      <PortalSection title="Readiness categories">
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <PortalCard key={c}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-dark">{c}</h3>
                <StatusPill status="Incomplete" />
              </div>
              <p className="mt-2 text-sm text-muted">No score recorded yet.</p>
            </PortalCard>
          ))}
        </div>
      </PortalSection>
    </div>
  );
}
