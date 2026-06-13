import { PortalLoginForm } from "@/components/portal/portal-login-form";

export default function BusinessLoginPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy">
          Issuer sign in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Access your capital-readiness workspace.
        </p>
      </div>
      <PortalLoginForm redirectTo="/business/dashboard" />
    </div>
  );
}
