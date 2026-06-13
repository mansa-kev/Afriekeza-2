import { PortalPageHeader } from "@/components/portal/page-header";
import { RaiseApplicationForm } from "@/components/business/raise-application-form";
import { getCurrentProfile, getRaiseApplicationForUser } from "@/lib/supabase/queries";

export default async function RaiseApplicationPage() {
  const { user } = await getCurrentProfile();
  const application = user ? await getRaiseApplicationForUser(user.id) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <PortalPageHeader
        title="Capital request"
        description="Structured raise application for Afriekeza review and structuring."
      />
      <RaiseApplicationForm application={application} />
    </div>
  );
}
