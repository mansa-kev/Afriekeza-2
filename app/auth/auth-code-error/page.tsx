import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-dark">Sign-in failed</h1>
      <p className="mt-2 text-sm text-muted">
        We could not complete authentication. Try signing in again.
      </p>
      <Link href="/" className="mt-6 text-sm text-blue hover:underline">
        Return home
      </Link>
    </div>
  );
}
