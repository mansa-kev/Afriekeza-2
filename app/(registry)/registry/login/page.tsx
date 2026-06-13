import { PortalLoginForm } from "@/components/portal/portal-login-form";

export default function RegistryLoginPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy">
          Afriekeza Registry
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to your capital readiness workspace.
        </p>
      </div>
      <PortalLoginForm redirectTo="/registry/dashboard" />
    </div>
  );
}
