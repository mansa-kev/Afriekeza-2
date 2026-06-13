"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  adminApproveDeposit,
  adminRejectDeposit,
  adminVerifyCommitmentPayment,
  recordRepaymentPaid,
  refundCommitment,
} from "@/lib/actions/operational";

export function DepositActions({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex gap-2">
      <Button
        variant="primary"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { await adminApproveDeposit(transactionId); router.refresh(); })}
      >
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { await adminRejectDeposit(transactionId); router.refresh(); })}
      >
        Reject
      </Button>
    </div>
  );
}

export function CommitmentPaymentActions({ commitmentId }: { commitmentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button
        variant="primary"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { await adminVerifyCommitmentPayment(commitmentId); router.refresh(); })}
      >
        Verify payment
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { await refundCommitment(commitmentId); router.refresh(); })}
      >
        Refund
      </Button>
    </div>
  );
}

export function RepaymentActions({ repaymentId }: { repaymentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => { await recordRepaymentPaid(repaymentId); router.refresh(); })}
    >
      Mark paid
    </Button>
  );
}

export function DocumentReviewActions({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-3 flex gap-2">
      <Button
        variant="primary"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { const { reviewDocument } = await import("@/lib/actions/operational"); await reviewDocument(documentId, true); router.refresh(); })}
      >
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => startTransition(async () => { const { reviewDocument } = await import("@/lib/actions/operational"); await reviewDocument(documentId, false); router.refresh(); })}
      >
        Reject
      </Button>
    </div>
  );
}

export function ReportPublishAction({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => { const { adminPublishIssuerReport } = await import("@/lib/actions/operational"); await adminPublishIssuerReport(reportId); router.refresh(); })}
    >
      Publish
    </Button>
  );
}
