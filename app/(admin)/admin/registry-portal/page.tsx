import { EmptyState } from "@/components/portal/empty-state";
import { PortalPageHeader } from "@/components/portal/page-header";

export default function AdminRegistryPage() {
  return (
    <div>
      <PortalPageHeader title="Registry oversight" description="Cap tables, ownership records, corporate actions." />
      <EmptyState title="No registry records" description="Cap table entries across issuers will appear here." />
    </div>
  );
}
