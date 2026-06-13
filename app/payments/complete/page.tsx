"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; status?: string }>;
}) {
  const [params, setParams] = useState<{ intent?: string; status?: string }>({});

  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  const success = params.status === "success";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
      <h1 className="text-xl font-semibold text-dark">
        {success ? "Payment submitted" : "Payment cancelled"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {success
          ? "We are confirming your payment. Your wallet or commitment will update shortly."
          : "No charge was made. You can try again from your wallet or portfolio."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button href="/investor/wallet" variant="primary">
          Wallet
        </Button>
        <Link href="/investor/portfolio" className="text-sm text-blue hover:underline self-center">
          Portfolio
        </Link>
      </div>
    </div>
  );
}
