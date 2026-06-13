"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveInvestorOnboardingStep } from "@/lib/actions/portal";

const STEPS = [
  "Account setup",
  "Identity verification",
  "Investor profile",
  "Suitability questionnaire",
  "Risk acknowledgement",
  "Classification",
];

const SUITABILITY_QUESTIONS = [
  { key: "investment_horizon", label: "What is your typical investment horizon?" },
  { key: "loss_tolerance", label: "How would you respond to a temporary loss on a private investment?" },
  { key: "liquidity_preference", label: "How important is access to cash from these investments?" },
];

const RISK_ACKS = [
  "private_market_illiquidity",
  "issuer_performance",
  "no_guaranteed_outcomes",
];

type Props = {
  initialStep?: number;
  initialProfile?: {
    full_name?: string | null;
    phone?: string | null;
  } | null;
};

export function InvestorOnboardingForm({ initialStep = 0, initialProfile }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [investmentExperience, setInvestmentExperience] = useState("");
  const [investmentGoals, setInvestmentGoals] = useState("");
  const [expectedTicket, setExpectedTicket] = useState("");
  const [liquidityNeed, setLiquidityNeed] = useState("");
  const [suitability, setSuitability] = useState<Record<string, string>>({});
  const [riskAcks, setRiskAcks] = useState<string[]>([]);
  const [classification, setClassification] = useState("retail");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  function toggleRiskAck(key: string) {
    setRiskAcks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function persist(nextStep: number, finalize = false) {
    setError(null);
    startTransition(async () => {
      const result = await saveInvestorOnboardingStep({
        step: nextStep,
        fullName: fullName || undefined,
        phone: phone || undefined,
        employmentStatus: employmentStatus || undefined,
        sourceOfFunds: sourceOfFunds || undefined,
        investmentExperience: investmentExperience || undefined,
        investmentGoals: investmentGoals || undefined,
        expectedTicketSizeKes: expectedTicket ? Number(expectedTicket) : undefined,
        liquidityNeed: liquidityNeed || undefined,
        classification: step >= 5 ? classification : undefined,
        suitabilityAnswers: Object.keys(suitability).length ? suitability : undefined,
        riskAcknowledgements: riskAcks.length ? riskAcks : undefined,
        termsAccepted: finalize ? termsAccepted : undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (finalize) {
        router.push("/investor/dashboard");
        router.refresh();
        return;
      }

      setStep(nextStep);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-6 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-blue" : "bg-soft-border"}`}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-header-border bg-white p-8">
        <p className="text-sm text-blue">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-dark">{STEPS[step]}</h2>

        {step === 0 && (
          <div className="mt-6 space-y-4">
            <Field label="Full name" value={fullName} onChange={setFullName} />
            <Field label="Phone" value={phone} onChange={setPhone} />
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted">
              Identity documents can be uploaded from your account once KYC review opens.
            </p>
            <Field label="Country of residence" value="Kenya" onChange={() => {}} readOnly />
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-4">
            <Field label="Employment status" value={employmentStatus} onChange={setEmploymentStatus} />
            <Field label="Source of funds" value={sourceOfFunds} onChange={setSourceOfFunds} />
            <Field label="Investment experience" value={investmentExperience} onChange={setInvestmentExperience} />
            <Field label="Investment goals" value={investmentGoals} onChange={setInvestmentGoals} />
            <Field label="Expected ticket size (KES)" value={expectedTicket} onChange={setExpectedTicket} type="number" />
            <Field label="Liquidity need" value={liquidityNeed} onChange={setLiquidityNeed} />
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-4">
            {SUITABILITY_QUESTIONS.map((q) => (
              <div key={q.key}>
                <label className="text-sm font-medium text-dark">{q.label}</label>
                <textarea
                  className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
                  rows={2}
                  value={suitability[q.key] ?? ""}
                  onChange={(e) =>
                    setSuitability((prev) => ({ ...prev, [q.key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 space-y-3">
            {RISK_ACKS.map((key) => (
              <label key={key} className="flex items-start gap-3 text-sm text-dark">
                <input
                  type="checkbox"
                  checked={riskAcks.includes(key)}
                  onChange={() => toggleRiskAck(key)}
                  className="mt-1"
                />
                <span>{key.replaceAll("_", " ")}</span>
              </label>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-dark">Investor classification</label>
              <select
                className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="retail">Retail</option>
                <option value="experienced">Experienced</option>
                <option value="sophisticated">Sophisticated</option>
                <option value="diaspora">Diaspora</option>
              </select>
            </div>
            <label className="flex items-start gap-3 text-sm text-dark">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
              />
              <span>I accept the Afriekeza investor terms and platform rules.</span>
            </label>
          </div>
        )}

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={pending}>
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="primary" disabled={pending} onClick={() => persist(step + 1)}>
              {pending ? "Saving…" : "Continue"}
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={pending || !termsAccepted}
              onClick={() => persist(step, true)}
            >
              {pending ? "Submitting…" : "Submit for review"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-dark">{label}</label>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
      />
    </div>
  );
}
