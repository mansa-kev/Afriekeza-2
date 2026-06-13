"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PortalCard } from "@/components/portal/portal-card";
import { StatusPill } from "@/components/portal/status-pill";
import {
  reviewReadinessItem,
  setCompanyRegistryStatus,
} from "@/lib/actions/registry";

type SubmittedItem = {
  id: string;
  company_id: string;
  category: string;
  title: string;
  status: string;
  companies?: { legal_name?: string; trading_name?: string } | null;
};

const REGISTRY_STATUSES = [
  "not_started",
  "improving",
  "registry_ready",
  "funding_review_ready",
  "under_review",
  "approved_for_platform",
];

export function RegistryAdminReviewPanel({
  submittedItems,
  companyStatuses,
}: {
  submittedItems: SubmittedItem[];
  companyStatuses: { id: string; legal_name: string; funding_readiness_status: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notes, setNotes] = useState<Record<string, string>>({});

  function handleReview(
    itemId: string,
    companyId: string,
    decision: "approved" | "rejected" | "needs_correction",
  ) {
    startTransition(async () => {
      await reviewReadinessItem({
        itemId,
        companyId,
        decision,
        notes: notes[itemId],
      });
      router.refresh();
    });
  }

  function handleCompanyStatus(companyId: string, status: string) {
    startTransition(async () => {
      await setCompanyRegistryStatus(companyId, status);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Submitted checklist items
        </h2>
        {submittedItems.length === 0 ? (
          <p className="text-sm text-muted">No items awaiting review.</p>
        ) : (
          <div className="space-y-3">
            {submittedItems.map((item) => {
              const company = item.companies;
              const name =
                company?.trading_name ?? company?.legal_name ?? "Company";
              return (
                <PortalCard key={item.id} padding="sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted">{name}</p>
                      <p className="font-medium text-dark">{item.title}</p>
                      <p className="text-xs capitalize text-muted">
                        {item.category.replaceAll("_", " ")}
                      </p>
                    </div>
                    <StatusPill status={item.status.replaceAll("_", " ")} />
                  </div>
                  <textarea
                    value={notes[item.id] ?? ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [item.id]: e.target.value }))
                    }
                    placeholder="Review notes (visible to company)"
                    rows={2}
                    className="mt-3 w-full rounded-lg border border-header-border px-3 py-2 text-sm"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        handleReview(item.id, item.company_id, "approved")
                      }
                      className="rounded-lg bg-green px-3 py-1.5 text-xs font-medium text-white hover:bg-green/90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        handleReview(item.id, item.company_id, "needs_correction")
                      }
                      className="rounded-lg border border-header-border px-3 py-1.5 text-xs font-medium text-dark hover:bg-off-white"
                    >
                      Needs correction
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        handleReview(item.id, item.company_id, "rejected")
                      }
                      className="rounded-lg border border-red/30 px-3 py-1.5 text-xs font-medium text-red hover:bg-red/5"
                    >
                      Reject
                    </button>
                  </div>
                </PortalCard>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Company registry status
        </h2>
        <div className="space-y-3">
          {companyStatuses.map((c) => (
            <PortalCard key={c.id} padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-dark">{c.legal_name}</p>
                <select
                  value={c.funding_readiness_status ?? "not_started"}
                  disabled={pending}
                  onChange={(e) => handleCompanyStatus(c.id, e.target.value)}
                  className="rounded-lg border border-header-border px-3 py-1.5 text-sm"
                >
                  {REGISTRY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </PortalCard>
          ))}
        </div>
      </section>
    </div>
  );
}
