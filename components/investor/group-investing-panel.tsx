"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createInvestmentGroup, joinInvestmentGroup } from "@/lib/actions/p3";

export function GroupInvestingPanel() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="rounded-2xl border border-soft-border bg-white p-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await createInvestmentGroup({ name, targetAmountKes: Number(target) });
          setName("");
          setTarget("");
          router.refresh();
        });
      }}
    >
      <h2 className="font-semibold text-dark">Start a group</h2>
      <input className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm" placeholder="Target amount (KES)" value={target} onChange={(e) => setTarget(e.target.value)} required />
      <Button variant="primary" disabled={pending}>Create group</Button>
    </form>
  );
}

export function JoinGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const amount = prompt("Pledge amount (KES)");
          if (!amount) return;
          await joinInvestmentGroup(groupId, Number(amount));
          router.refresh();
        })
      }
    >
      Join group
    </Button>
  );
}
