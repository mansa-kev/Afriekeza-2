export type InvestorEligibility = {
  canCommit: boolean;
  reasons: string[];
};

type InvestorProfile = {
  kyc_status?: string;
  suitability_status?: string;
  account_status?: string;
};

type Opportunity = {
  status?: string;
  minimum_investment_kes?: number;
};

const OPEN_STATUSES = new Set(["open", "closing_soon"]);

export function checkInvestorEligibility(
  investor: InvestorProfile | null | undefined,
  opportunity: Opportunity | null | undefined,
  amountKes?: number,
): InvestorEligibility {
  const reasons: string[] = [];

  if (!investor) {
    return { canCommit: false, reasons: ["Complete investor onboarding first."] };
  }

  if (investor.kyc_status !== "approved") {
    reasons.push("KYC must be approved before investing.");
  }

  if (investor.suitability_status !== "approved") {
    reasons.push("Suitability review must be approved before investing.");
  }

  if (!opportunity) {
    reasons.push("Opportunity not found.");
    return { canCommit: false, reasons };
  }

  if (!OPEN_STATUSES.has(opportunity.status ?? "")) {
    reasons.push("This opportunity is not open for commitments.");
  }

  if (amountKes != null && opportunity.minimum_investment_kes != null) {
    if (amountKes < Number(opportunity.minimum_investment_kes)) {
      reasons.push(
        `Minimum commitment is KES ${Number(opportunity.minimum_investment_kes).toLocaleString()}.`,
      );
    }
  }

  return { canCommit: reasons.length === 0, reasons };
}
