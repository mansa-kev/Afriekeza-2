import { DocumentUploadPanel } from "@/components/business/data-room-upload";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { getCurrentProfile, getCompanyForUser, listDocumentsForOwner } from "@/lib/supabase/queries";

const CATEGORIES = [
  "Financials",
  "Governance",
  "Contracts",
  "Tax",
  "Bank statements",
  "Investor documents",
];

export default async function DataRoomPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const companyId = membership?.company_id;
  const { data: documents } = companyId
    ? await listDocumentsForOwner("company", companyId)
    : { data: [] };

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, category) => {
    acc[category] = (documents ?? []).filter((d) => d.category === category).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Data room"
        description="Organized company documents for due diligence and investor review."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <PortalCard key={c} padding="sm">
            <p className="text-sm font-medium text-dark">{c}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-navy">
              {counts[c] ?? 0}
            </p>
            <p className="text-xs text-muted">files uploaded</p>
          </PortalCard>
        ))}
      </div>

      <PortalSection title="Upload documents">
        {companyId ? (
          <DocumentUploadPanel
            companyId={companyId}
            categories={CATEGORIES}
            documents={documents ?? []}
          />
        ) : (
          <p className="text-sm text-muted">
            Save your company profile before uploading documents.
          </p>
        )}
      </PortalSection>
    </div>
  );
}
