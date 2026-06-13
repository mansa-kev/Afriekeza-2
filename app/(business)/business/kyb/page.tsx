import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { StatusPill } from "@/components/portal/status-pill";

const ITEMS = [
  "Business registration",
  "Directors",
  "Beneficial ownership",
  "Tax compliance",
  "Bank statements",
];

export default function KybPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="KYB status"
        description="Business verification, document checklist, and review comments."
      />
      <PortalSection title="Verification checklist">
        <div className="space-y-3">
          {ITEMS.map((item) => (
            <PortalCard key={item} padding="sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-dark">{item}</span>
                <StatusPill status="Not started" />
              </div>
            </PortalCard>
          ))}
        </div>
      </PortalSection>
    </div>
  );
}
