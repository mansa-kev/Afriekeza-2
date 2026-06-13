"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSecondaryListing } from "@/lib/actions/p3";

export function SecondaryListingForm({
  positions,
}: {
  positions: Array<{ id: string; title: string; principal_kes: number }>;
}) {
  const router = useRouter();
  const [positionId, setPositionId] = useState(positions[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();

  if (positions.length === 0) return null;

  return (
    <form
      className="rounded-2xl border border-soft-border bg-white p-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await createSecondaryListing({
            positionId,
            askingAmountKes: Number(amount),
            notes: notes || undefined,
          });
          router.refresh();
        });
      }}
    >
      <h2 className="font-semibold text-dark">List a position</h2>
      <select className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm" value={positionId} onChange={(e) => setPositionId(e.target.value)}>
        {positions.map((p) => (
          <option key={p.id} value={p.id}>{p.title} · KES {Number(p.principal_kes).toLocaleString()}</option>
        ))}
      </select>
      <input type="number" placeholder="Asking amount (KES)" className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <input placeholder="Notes (optional)" className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button variant="primary" disabled={pending}>Create listing</Button>
    </form>
  );
}
