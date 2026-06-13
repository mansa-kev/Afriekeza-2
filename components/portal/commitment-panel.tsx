"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createCommitment } from "@/lib/actions/portal";

type Props = {
  opportunityId: string;
  minimumKes: number;
  canCommit: boolean;
  blockReasons: string[];
  existingStatus?: string | null;
};

export function CommitmentPanel({
  opportunityId,
  minimumKes,
  canCommit,
  blockReasons,
  existingStatus,
}: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(minimumKes));
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  if (existingStatus && existingStatus !== "cancelled" && existingStatus !== "refunded") {
    return (
      <section className="rounded-2xl border border-header-border bg-white p-6">
        <h2 className="font-semibold text-dark">Your commitment</h2>
        <p className="mt-2 text-sm text-muted">
          Status: {existingStatus.replaceAll("_", " ")}. Track progress in your portfolio.
        </p>
      </section>
    );
  }

  if (!canCommit) {
    return (
      <section className="rounded-2xl border border-header-border bg-white p-6">
        <h2 className="font-semibold text-dark">Commitment</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {blockReasons.map((reason) => (
            <li key={reason}>· {reason}</li>
          ))}
        </ul>
      </section>
    );
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createCommitment({
        opportunityId,
        amountKes: Number(amount),
        acknowledgementComplete: acknowledged,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  if (success) {
    return (
      <section className="rounded-2xl border border-header-border bg-white p-6">
        <h2 className="font-semibold text-dark">Commitment submitted</h2>
        <p className="mt-2 text-sm text-muted">
          Your commitment is pending payment verification. Afriekeza will confirm allocation after review.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-header-border bg-white p-6">
      <h2 className="font-semibold text-dark">Commit capital</h2>
      <p className="mt-2 text-sm text-muted">
        Minimum KES {minimumKes.toLocaleString()}. Payment rails are not live — commitments enter admin review.
      </p>
      <div className="mt-4">
        <label className="text-sm font-medium text-dark">Amount (KES)</label>
        <input
          type="number"
          min={minimumKes}
          className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm text-dark">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-1"
        />
        <span>
          I confirm I have read the opportunity documents, understand the terms, and accept the risk profile for this investment.
        </span>
      </label>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <Button
        variant="primary"
        className="mt-6"
        disabled={pending || !acknowledged || !amount}
        onClick={handleSubmit}
      >
        {pending ? "Submitting…" : "Submit commitment"}
      </Button>
    </section>
  );
}
