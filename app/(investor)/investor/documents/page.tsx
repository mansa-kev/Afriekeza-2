import { DocumentUpload } from "@/components/portal/document-upload";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { PortalSection } from "@/components/portal/portal-section";
import { getCurrentProfile, listDocumentsForOwner } from "@/lib/supabase/queries";

const CATEGORIES = ["Identity", "Proof of address", "Agreements", "Tax forms"];

export default async function DocumentsPage() {
  const { user } = await getCurrentProfile();
  const { data: documents } = user
    ? await listDocumentsForOwner("investor", user.id)
    : { data: [] };

  return (
    <div className="max-w-2xl space-y-6">
      <PortalPageHeader
        title="Documents"
        description="Agreements, disclosures, receipts, and profile documents."
      />

      {user ? (
        <div className="space-y-6">
          {CATEGORIES.map((category) => (
            <PortalSection key={category} title={category}>
              <PortalCard>
                <DocumentUpload
                  ownerType="investor"
                  ownerId={user.id}
                  category={category}
                />
                <ul className="mt-3 space-y-1">
                  {(documents ?? [])
                    .filter((d) => d.category === category)
                    .map((d) => (
                      <li key={d.id} className="text-sm text-muted">
                        {d.file_name} · {d.status.replaceAll("_", " ")}
                      </li>
                    ))}
                </ul>
              </PortalCard>
            </PortalSection>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sign in required"
          description="Sign in to upload and view your documents."
        />
      )}
    </div>
  );
}
