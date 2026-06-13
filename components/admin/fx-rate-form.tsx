"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updatePlatformFxRate } from "@/lib/actions/operational";

export function FxRateForm({ currentRate }: { currentRate: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(String(currentRate));
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="rounded-xl border border-soft-border bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await updatePlatformFxRate(Number(rate));
          router.refresh();
        });
      }}
    >
      <h2 className="text-sm font-semibold text-dark">FX display rate</h2>
      <p className="mt-1 text-xs text-muted">KES per 1 USD — used for currency switcher display.</p>
      <div className="mt-3 flex gap-3">
        <input
          type="number"
          className="w-32 rounded-lg border border-soft-border px-3 py-2 text-sm"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <Button variant="primary" size="sm" disabled={pending}>Save</Button>
      </div>
    </form>
  );
}
