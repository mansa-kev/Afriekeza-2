import { PortalLoginForm } from "@/components/portal/portal-login-form";
import { PortalSignupForm } from "@/components/portal/portal-signup-form";

export default function InvestorLoginPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy">
          Investor sign in
        </h1>
        <p className="mt-2 text-sm text-muted">Access your Afriekeza investor account.</p>
      </div>
      <PortalLoginForm redirectTo="/investor/dashboard" />
      <div className="mt-10 border-t border-header-border pt-10">
        <div className="mb-6 text-center">
          <h2 className="font-display text-lg font-semibold text-navy">New investor</h2>
          <p className="mt-1 text-sm text-muted">Create an account and complete verification.</p>
        </div>
        <PortalSignupForm redirectTo="/investor/onboarding" />
      </div>
    </div>
  );
}
