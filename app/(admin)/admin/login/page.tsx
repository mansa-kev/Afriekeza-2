import { PortalLoginForm } from "@/components/portal/portal-login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-muted">Internal operations access only.</p>
      </div>
      <PortalLoginForm redirectTo="/admin/dashboard" />
    </div>
  );
}
