import { PortalCard } from "@/components/portal/portal-card";
import { formatReadinessLabel } from "@/lib/registry/score";
import type { ReadinessScoreResult } from "@/lib/registry/score";

export function ReadinessScorePanel({ score }: { score: ReadinessScoreResult }) {
  return (
    <PortalCard className="border-blue/20 bg-soft-blue/20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Funding readiness</p>
          <p className="text-4xl font-bold tabular-nums text-navy">
            {score.overallScore}%
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-blue">
            {formatReadinessLabel(score.readinessLabel)}
          </p>
        </div>
        <div className="text-right text-sm text-muted">
          <p>
            {score.approvedCount} approved · {score.missingRequired.length} required
            remaining
          </p>
        </div>
      </div>
      {score.missingRequired.length > 0 && (
        <div className="mt-4 border-t border-header-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Missing required items
          </p>
          <ul className="mt-2 space-y-1 text-sm text-dark">
            {score.missingRequired.slice(0, 5).map((t) => (
              <li key={t}>· {t}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {Object.entries(score.categoryScores).map(([cat, val]) => (
          <div
            key={cat}
            className="rounded-lg border border-header-border bg-white/80 px-3 py-2"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {cat.replaceAll("_", " ")}
            </p>
            <p className="text-lg font-bold text-dark">{val}%</p>
          </div>
        ))}
      </div>
    </PortalCard>
  );
}
