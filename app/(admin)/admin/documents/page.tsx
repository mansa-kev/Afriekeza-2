import { DocumentReviewActions } from "@/components/admin/operational-actions";
import { EmptyState } from "@/components/portal/empty-state";
import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { listDocumentsForReview } from "@/lib/supabase/queries";

export default async function AdminDocumentsPage() {
  const { data: documents } = await listDocumentsForReview();

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Document review"
        description="Global document queue, versions, and expiry tracking."
      />

      {(documents ?? []).length === 0 ? (
        <EmptyState
          title="No documents in review"
          description="Uploaded documents awaiting compliance review will appear here."
        />
      ) : (
        <div className="grid gap-4">
          {(documents ?? []).map((doc) => {
            const uploader = doc.profiles as { full_name?: string; email?: string } | null;
            return (
              <PortalCard key={doc.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-dark">{doc.file_name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {doc.owner_type} · {doc.category} ·{" "}
                      {uploader?.full_name ?? uploader?.email ?? "Unknown"}
                    </p>
                  </div>
                  <StatusPill status={String(doc.status).replaceAll("_", " ")} />
                </div>
                <DocumentReviewActions documentId={doc.id} />
              </PortalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
