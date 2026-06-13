import { PortalCard } from "@/components/portal/portal-card";
import { PortalPageHeader } from "@/components/portal/page-header";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { getRegistryCompanyContext } from "@/lib/registry/queries";
import { createClient } from "@/lib/supabase/server";

export default async function RegistrySettingsPage() {
  const { user, profile } = await getCurrentProfile();
  const membership = user ? await getRegistryCompanyContext(user.id) : null;
  const companyId = membership?.company_id;

  const supabase = await createClient();
  const { data: subscription } = companyId
    ? await supabase
        .from("registry_subscriptions")
        .select("*")
        .eq("company_id", companyId)
        .maybeSingle()
    : { data: null };

  return (
    <div className="max-w-2xl space-y-6">
      <PortalPageHeader
        title="Settings"
        description="Workspace, plan, and account preferences."
      />

      <PortalCard>
        <h2 className="font-semibold text-dark">Account</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium">{user?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Name</dt>
            <dd className="font-medium">{profile?.full_name ?? "—"}</dd>
          </div>
        </dl>
      </PortalCard>

      <PortalCard>
        <h2 className="font-semibold text-dark">Registry subscription</h2>
        {subscription ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Plan</dt>
              <dd className="font-medium capitalize">{subscription.plan_tier}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd className="font-medium capitalize">{subscription.status}</dd>
            </div>
            {subscription.billing_amount_kes != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Billing</dt>
                <dd className="font-medium">
                  KES {Number(subscription.billing_amount_kes).toLocaleString()} /{" "}
                  {subscription.billing_period}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Trial plan activates when you create your company workspace.
          </p>
        )}
        <p className="mt-4 text-xs text-muted">
          Paid plans (Starter, Growth, Capital Ready) are configured by Afriekeza
          during onboarding. Contact support to upgrade.
        </p>
      </PortalCard>
    </div>
  );
}
