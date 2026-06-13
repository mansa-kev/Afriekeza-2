"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveRaiseApplication } from "@/lib/actions/portal";

const STEPS = [
  "Purpose",
  "Capital request",
  "Financial evidence",
  "Business explanation",
  "Security / support",
  "Review summary",
  "Submit",
];

type Application = {
  instrument?: string;
  amount_requested_kes?: number;
  preferred_tenor_months?: number | null;
  target_timeline?: string | null;
  repayment_notes?: string | null;
  status?: string;
};

export function RaiseApplicationForm({ application }: { application?: Application | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [instrument, setInstrument] = useState(application?.instrument ?? "growth_note");
  const [amount, setAmount] = useState(String(application?.amount_requested_kes ?? ""));
  const [tenor, setTenor] = useState(String(application?.preferred_tenor_months ?? ""));
  const [timeline, setTimeline] = useState(application?.target_timeline ?? "");
  const [notes, setNotes] = useState(application?.repayment_notes ?? "");
  const [purpose, setPurpose] = useState("");

  function save(submit = false) {
    setError(null);
    startTransition(async () => {
      const result = await saveRaiseApplication({
        instrument,
        amountRequestedKes: Number(amount),
        preferredTenorMonths: tenor ? Number(tenor) : undefined,
        targetTimeline: timeline || undefined,
        repaymentNotes: notes || purpose || undefined,
        useOfFunds: purpose ? [{ label: "Primary use", amount_kes: Number(amount) || 0, description: purpose }] : [],
        submit,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (submit) {
        router.refresh();
        return;
      }
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-header-border bg-white p-8">
      <p className="text-sm text-blue">
        Step {step + 1}: {STEPS[step]}
        {application?.status ? ` · Status: ${application.status}` : ""}
      </p>

      {step === 0 && (
        <textarea
          className="mt-4 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
          rows={4}
          placeholder="Describe the purpose of this raise"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      )}

      {step === 1 && (
        <div className="mt-4 space-y-4">
          <select
            className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            <option value="yield">Yield</option>
            <option value="revenue_backed">Revenue-backed</option>
            <option value="asset_backed">Asset-backed</option>
            <option value="growth_note">Growth note</option>
          </select>
          <input
            type="number"
            className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            placeholder="Amount requested (KES)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="number"
            className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            placeholder="Preferred tenor (months)"
            value={tenor}
            onChange={(e) => setTenor(e.target.value)}
          />
        </div>
      )}

      {(step === 2 || step === 3 || step === 4) && (
        <p className="mt-4 text-sm text-muted">
          Upload supporting documents from the data room. Financial evidence and security details attach here during pilot review.
        </p>
      )}

      {step === 5 && (
        <div className="mt-4 space-y-2 text-sm text-dark">
          <p>Instrument: {instrument}</p>
          <p>Amount: KES {amount || "—"}</p>
          <p>Tenor: {tenor || "—"} months</p>
          <textarea
            className="mt-2 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            rows={3}
            placeholder="Repayment / support notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            placeholder="Target timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </div>
      )}

      {step === 6 && (
        <p className="mt-4 text-sm text-muted">
          Submitting sends your application to Afriekeza for structuring review.
        </p>
      )}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={pending}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 && (
          <Button variant="primary" disabled={pending} onClick={() => save(false)}>
            {pending ? "Saving…" : "Save & next"}
          </Button>
        )}
        {step === STEPS.length - 1 && (
          <Button variant="primary" disabled={pending || !amount} onClick={() => save(true)}>
            {pending ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </div>
  );
}
