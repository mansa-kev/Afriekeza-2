"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveUseOfFundsItem } from "@/lib/actions/operational";

type Item = {
  id: string;
  category: string;
  budget_kes: number;
  actual_kes: number;
  variance_note: string | null;
};

export function UseOfFundsManager({
  companyId,
  items,
}: {
  companyId: string;
  items: Item[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [actual, setActual] = useState("");
  const [note, setNote] = useState("");

  function addItem() {
    startTransition(async () => {
      await saveUseOfFundsItem({
        companyId,
        category,
        budgetKes: Number(budget),
        actualKes: Number(actual),
        varianceNote: note || undefined,
      });
      setCategory("");
      setBudget("");
      setActual("");
      setNote("");
      router.refresh();
    });
  }

  const totalBudget = items.reduce((s, i) => s + Number(i.budget_kes), 0);
  const totalActual = items.reduce((s, i) => s + Number(i.actual_kes), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Budget" value={totalBudget} />
        <Metric label="Deployed" value={totalActual} />
        <Metric label="Variance" value={totalActual - totalBudget} />
      </div>

      <div className="rounded-2xl border border-header-border bg-white p-6 space-y-3">
        <h2 className="font-semibold text-dark">Add line item</h2>
        <input placeholder="Category" className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm" value={category} onChange={(e) => setCategory(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="number" placeholder="Budget (KES)" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={budget} onChange={(e) => setBudget(e.target.value)} />
          <input type="number" placeholder="Actual (KES)" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={actual} onChange={(e) => setActual(e.target.value)} />
        </div>
        <input placeholder="Variance note" className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button variant="primary" disabled={pending || !category} onClick={addItem}>Save item</Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-header-border bg-white p-4">
            <p className="font-medium text-dark">{item.category}</p>
            <p className="mt-1 text-sm text-muted">
              Budget KES {Number(item.budget_kes).toLocaleString()} · Actual KES {Number(item.actual_kes).toLocaleString()}
            </p>
            {item.variance_note ? <p className="mt-1 text-sm text-muted">{item.variance_note}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-header-border bg-white p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-dark">KES {value.toLocaleString()}</p>
    </div>
  );
}
