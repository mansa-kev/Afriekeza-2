export type ReadinessItemRow = {
  id: string;
  category: string;
  title: string;
  weight: number;
  required: boolean;
  status: string;
};

export type ReadinessScoreResult = {
  overallScore: number;
  readinessLabel: string;
  categoryScores: Record<string, number>;
  approvedCount: number;
  requiredCount: number;
  missingRequired: string[];
};

const APPROVED_STATUSES = new Set(["approved", "uploaded", "submitted"]);

export function calculateReadinessScore(items: ReadinessItemRow[]): ReadinessScoreResult {
  const categoryMap: Record<string, { earned: number; total: number }> = {};
  const missingRequired: string[] = [];
  let approvedCount = 0;
  let requiredCount = 0;

  for (const item of items) {
    const weight = item.weight || 1;
    const cat = item.category;
    if (!categoryMap[cat]) categoryMap[cat] = { earned: 0, total: 0 };
    categoryMap[cat].total += weight;

    const done = APPROVED_STATUSES.has(item.status);
    if (done) {
      categoryMap[cat].earned += weight;
      approvedCount += 1;
    }
    if (item.required) {
      requiredCount += 1;
      if (!done) missingRequired.push(item.title);
    }
  }

  const totalWeight = items.reduce((s, i) => s + (i.weight || 1), 0);
  const earnedWeight = items
    .filter((i) => APPROVED_STATUSES.has(i.status))
    .reduce((s, i) => s + (i.weight || 1), 0);

  const overallScore =
    totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  const categoryScores: Record<string, number> = {};
  for (const [cat, { earned, total }] of Object.entries(categoryMap)) {
    categoryScores[cat] = total > 0 ? Math.round((earned / total) * 100) : 0;
  }

  let readinessLabel = "not_ready";
  if (overallScore >= 90 && missingRequired.length === 0) {
    readinessLabel = "funding_review_ready";
  } else if (overallScore >= 75) {
    readinessLabel = "registry_ready";
  } else if (overallScore >= 50) {
    readinessLabel = "improving";
  }

  return {
    overallScore,
    readinessLabel,
    categoryScores,
    approvedCount,
    requiredCount,
    missingRequired,
  };
}

export function formatReadinessLabel(label: string) {
  return label.replaceAll("_", " ");
}
