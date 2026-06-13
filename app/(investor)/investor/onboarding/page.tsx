import { PortalPageHeader } from "@/components/portal/page-header";
import { InvestorOnboardingForm } from "@/components/portal/investor-onboarding-form";
import { getCurrentProfile, getInvestorProfile } from "@/lib/supabase/queries";

export default async function OnboardingPage() {
  const { user, profile } = await getCurrentProfile();
  const investor = user ? await getInvestorProfile(user.id) : null;

  return (
    <div className="mx-auto max-w-xl">
      <PortalPageHeader
        title="Investor onboarding"
        description="Complete each step to access suitable opportunities."
      />
      <InvestorOnboardingForm
        initialStep={investor?.onboarding_step ?? 0}
        initialProfile={profile}
      />
    </div>
  );
}
