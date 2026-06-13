import { FxRateForm } from "@/components/admin/fx-rate-form";
import { PortalPageHeader } from "@/components/portal/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: fx } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "fx_rates")
    .maybeSingle();

  const kesPerUsd = (fx?.value as { kes_per_usd?: number })?.kes_per_usd ?? 129;

  return (
    <div className="max-w-2xl">
      <PortalPageHeader title="Settings" description="Roles, permissions, templates, FX rates, notifications." />
      <FxRateForm currentRate={kesPerUsd} />
    </div>
  );
}
