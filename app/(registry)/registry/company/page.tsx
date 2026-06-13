import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { CompanyProfileForm } from "@/components/business/company-profile-form";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { getRegistryCompanyContext } from "@/lib/registry/queries";

export default async function RegistryCompanyPage() {
  const { user } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const company = membership?.companies;
  const companyData = company && !Array.isArray(company) ? company : null;

  return (
    <div className="max-w-3xl space-y-6">
      <PortalPageHeader
        title="Company profile"
        description="Legal details, directors, ownership, and operational record."
      />
      <PortalCard>
        <CompanyProfileForm company={companyData} />
      </PortalCard>
    </div>
  );
}
