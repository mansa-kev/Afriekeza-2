"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/portal/status-pill";
import { saveIssuerReport } from "@/lib/actions/operational";

type Report = {
  id: string;
  period_label: string;
  status: string;
  content: { summary?: string };
  submitted_at: string | null;
  published_at: string | null;
};

export function IssuerReportingManager({
  companyId,
  reports,
}: {
  companyId: string;
  reports: Report[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [periodLabel, setPeriodLabel] = useState("");
  const [summary, setSummary] = useState("");

  function save(submit: boolean) {
    startTransition(async () => {
      await saveIssuerReport({
        companyId,
        periodLabel,
        summary,
        submit,
      });
      setPeriodLabel("");
      setSummary("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-header-border bg-white p-6 space-y-3">
        <h2 className="font-semibold text-dark">New investor update</h2>
        <input placeholder="Period label (e.g. Q1 2026)" className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm" value={periodLabel} onChange={(e) => setPeriodLabel(e.target.value)} />
        <textarea rows={5} placeholder="Summary for investors" className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm" value={summary} onChange={(e) => setSummary(e.target.value)} />
        <div className="flex gap-3">
          <Button variant="outline" disabled={pending || !periodLabel} onClick={() => save(false)}>Save draft</Button>
          <Button variant="primary" disabled={pending || !periodLabel || !summary} onClick={() => save(true)}>Submit for review</Button>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <article key={r.id} className="rounded-xl border border-header-border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-dark">{r.period_label}</p>
              <StatusPill status={r.status.replaceAll("_", " ")} />
            </div>
            <p className="mt-2 text-sm text-muted">{(r.content as { summary?: string })?.summary ?? "—"}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
