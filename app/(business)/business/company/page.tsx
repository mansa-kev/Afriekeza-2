import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { CompanyProfileForm } from "@/components/business/company-profile-form";
import { getCurrentProfile, getCompanyForUser } from "@/lib/supabase/queries";

export default async function CompanyPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getCompanyForUser(user.id) : null;
  const company = membership?.companies;
  const companyData = company && !Array.isArray(company) ? company : null;

  return (
    <div className="max-w-3xl space-y-6">
      <PortalPageHeader
        title="Company profile"
        description="Legal details, operations, team, and ownership structure."
      />
      <PortalCard>
        <h2 className="font-semibold text-dark">Legal & business profile</h2>
        <div className="mt-4">
          <CompanyProfileForm company={companyData} />
        </div>
      </PortalCard>
    </div>
  );
}
