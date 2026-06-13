import { ComingSoonPanel } from "@/components/portal/coming-soon-panel";
import { PortalPageHeader } from "@/components/portal/page-header";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Team & permissions"
        description="Company users, roles, and invitations."
      />
      <ComingSoonPanel
        title="Team invitations"
        description="Invite finance leads, admins, and advisors with role-based access."
      />
    </div>
  );
}
