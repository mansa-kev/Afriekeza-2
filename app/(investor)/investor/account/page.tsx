import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { StatusPill } from "@/components/portal/status-pill";
import { getCurrentProfile, getInvestorProfile } from "@/lib/supabase/queries";

function formatStatus(value: string | undefined) {
  if (!value) return "Not started";
  return value.replaceAll("_", " ");
}

export default async function AccountPage() {
  const { user, profile } = await getCurrentProfile();
  const investor = user ? await getInvestorProfile(user.id) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <PortalPageHeader
        title="Account"
        description="Profile, verification status, security, and preferences."
      />

      <PortalCard>
        <h2 className="font-semibold text-dark">Profile</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium text-dark">{user?.email ?? "Not signed in"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Name</dt>
            <dd className="font-medium text-dark">{profile?.full_name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Preferred currency</dt>
            <dd className="font-medium text-dark">{profile?.preferred_currency ?? "KES"}</dd>
          </div>
        </dl>
      </PortalCard>

      <PortalCard>
        <h2 className="font-semibold text-dark">Verification status</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill status={`KYC ${formatStatus(investor?.kyc_status)}`} />
          <StatusPill status={`Suitability ${formatStatus(investor?.suitability_status)}`} />
        </div>
      </PortalCard>
    </div>
  );
}
