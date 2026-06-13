"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusPill } from "@/components/portal/status-pill";
import { PortalCard } from "@/components/portal/portal-card";
import {
  submitReadinessItem,
  updateReadinessItemStatus,
} from "@/lib/actions/registry";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  required: boolean;
  admin_notes: string | null;
};

const STATUS_FLOW = [
  "not_started",
  "in_progress",
  "uploaded",
  "submitted",
  "approved",
  "needs_correction",
];

export function ReadinessChecklist({
  companyId,
  items,
  adminView,
}: {
  companyId: string;
  items: Item[];
  adminView?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  function cycleStatus(current: string) {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 2) return "in_progress";
    return STATUS_FLOW[idx + 1];
  }

  function handleUpdate(itemId: string, status: string) {
    startTransition(async () => {
      await updateReadinessItemStatus(itemId, status, companyId);
      router.refresh();
    });
  }

  function handleSubmit(itemId: string) {
    startTransition(async () => {
      await submitReadinessItem(itemId, companyId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, rows]) => (
        <section key={category}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            {category.replaceAll("_", " ")}
          </h3>
          <div className="space-y-3">
            {rows.map((item) => (
              <PortalCard key={item.id} padding="sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark">
                      {item.title}
                      {item.required && (
                        <span className="ml-1 text-xs text-muted">(required)</span>
                      )}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-muted">{item.description}</p>
                    )}
                    {item.admin_notes && (
                      <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-warning">
                        Afriekeza: {item.admin_notes}
                      </p>
                    )}
                  </div>
                  <StatusPill status={item.status.replaceAll("_", " ")} />
                </div>
                {!adminView && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleUpdate(item.id, cycleStatus(item.status))}
                      className="rounded-lg border border-header-border px-3 py-1.5 text-xs font-medium text-dark hover:bg-off-white"
                    >
                      Mark in progress
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleUpdate(item.id, "uploaded")}
                      className="rounded-lg border border-header-border px-3 py-1.5 text-xs font-medium text-dark hover:bg-off-white"
                    >
                      Mark uploaded
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => handleSubmit(item.id)}
                      className={cn(
                        "rounded-lg bg-blue px-3 py-1.5 text-xs font-medium text-white hover:bg-blue/90",
                        pending && "opacity-60",
                      )}
                    >
                      Submit for review
                    </button>
                  </div>
                )}
              </PortalCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
