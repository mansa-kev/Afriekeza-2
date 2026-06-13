"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { reviewCompanyKyb, reviewInvestorKyc } from "@/lib/actions/portal";

export function InvestorReviewActions({ investorId }: { investorId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function review(approve: boolean) {
    startTransition(async () => {
      await reviewInvestorKyc(investorId, approve);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex gap-3">
      <Button variant="primary" disabled={pending} onClick={() => review(true)}>
        Approve KYC & suitability
      </Button>
      <Button variant="outline" disabled={pending} onClick={() => review(false)}>
        Reject
      </Button>
    </div>
  );
}

export function BusinessReviewActions({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function review(approve: boolean) {
    startTransition(async () => {
      await reviewCompanyKyb(companyId, approve);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex gap-3">
      <Button variant="primary" disabled={pending} onClick={() => review(true)}>
        Approve KYB
      </Button>
      <Button variant="outline" disabled={pending} onClick={() => review(false)}>
        Reject KYB
      </Button>
    </div>
  );
}
