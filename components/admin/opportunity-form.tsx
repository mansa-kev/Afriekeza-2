"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveOpportunity } from "@/lib/actions/portal";

type CompanyOption = { id: string; legal_name: string };
type Opportunity = {
  id?: string;
  company_id?: string;
  slug?: string;
  title?: string;
  instrument?: string;
  target_raise_kes?: number;
  minimum_investment_kes?: number;
  tenor_months?: number | null;
  target_return_pct?: number | null;
  repayment_frequency?: string | null;
  risk_label?: string | null;
  suitability_level?: string | null;
  sector?: string | null;
  location?: string | null;
  plain_summary?: string | null;
  what_you_own?: string | null;
  status?: string;
};

export function OpportunityForm({
  companies,
  opportunity,
}: {
  companies: CompanyOption[];
  opportunity?: Opportunity | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [companyId, setCompanyId] = useState(opportunity?.company_id ?? companies[0]?.id ?? "");
  const [slug, setSlug] = useState(opportunity?.slug ?? "");
  const [title, setTitle] = useState(opportunity?.title ?? "");
  const [instrument, setInstrument] = useState(opportunity?.instrument ?? "growth_note");
  const [targetRaise, setTargetRaise] = useState(String(opportunity?.target_raise_kes ?? ""));
  const [minimum, setMinimum] = useState(String(opportunity?.minimum_investment_kes ?? ""));
  const [tenor, setTenor] = useState(String(opportunity?.tenor_months ?? ""));
  const [targetReturn, setTargetReturn] = useState(String(opportunity?.target_return_pct ?? ""));
  const [repaymentFrequency, setRepaymentFrequency] = useState(opportunity?.repayment_frequency ?? "");
  const [riskLabel, setRiskLabel] = useState(opportunity?.risk_label ?? "");
  const [suitabilityLevel, setSuitabilityLevel] = useState(opportunity?.suitability_level ?? "");
  const [sector, setSector] = useState(opportunity?.sector ?? "");
  const [location, setLocation] = useState(opportunity?.location ?? "");
  const [plainSummary, setPlainSummary] = useState(opportunity?.plain_summary ?? "");
  const [whatYouOwn, setWhatYouOwn] = useState(opportunity?.what_you_own ?? "");
  const [status, setStatus] = useState(opportunity?.status ?? "draft");

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveOpportunity({
        id: opportunity?.id,
        companyId,
        slug,
        title,
        instrument,
        targetRaiseKes: Number(targetRaise),
        minimumInvestmentKes: Number(minimum),
        tenorMonths: tenor ? Number(tenor) : undefined,
        targetReturnPct: targetReturn ? Number(targetReturn) : undefined,
        repaymentFrequency: repaymentFrequency || undefined,
        riskLabel: riskLabel || undefined,
        suitabilityLevel: suitabilityLevel || undefined,
        sector: sector || undefined,
        location: location || undefined,
        plainSummary: plainSummary || undefined,
        whatYouOwn: whatYouOwn || undefined,
        status,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(`/admin/opportunity-builder/${result.id}`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <select
        className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.legal_name}
          </option>
        ))}
      </select>
      <Field label="Slug" value={slug} onChange={setSlug} />
      <Field label="Title" value={title} onChange={setTitle} />
      <select
        className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm"
        value={instrument}
        onChange={(e) => setInstrument(e.target.value)}
      >
        <option value="yield">Yield</option>
        <option value="revenue_backed">Revenue-backed</option>
        <option value="asset_backed">Asset-backed</option>
        <option value="growth_note">Growth note</option>
      </select>
      <Field label="Target raise (KES)" value={targetRaise} onChange={setTargetRaise} type="number" />
      <Field label="Minimum investment (KES)" value={minimum} onChange={setMinimum} type="number" />
      <Field label="Tenor (months)" value={tenor} onChange={setTenor} type="number" />
      <Field label="Target return (%)" value={targetReturn} onChange={setTargetReturn} type="number" />
      <Field label="Repayment frequency" value={repaymentFrequency} onChange={setRepaymentFrequency} />
      <Field label="Risk label" value={riskLabel} onChange={setRiskLabel} />
      <Field label="Suitability level" value={suitabilityLevel} onChange={setSuitabilityLevel} />
      <Field label="Sector" value={sector} onChange={setSector} />
      <Field label="Location" value={location} onChange={setLocation} />
      <TextArea label="Plain summary" value={plainSummary} onChange={setPlainSummary} />
      <TextArea label="What you own" value={whatYouOwn} onChange={setWhatYouOwn} />
      <select
        className="w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="draft">Draft</option>
        <option value="internal_review">Internal review</option>
        <option value="coming_soon">Coming soon</option>
        <option value="open">Open</option>
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button variant="primary" disabled={pending || !companyId || !slug || !title} onClick={handleSave}>
        {pending ? "Saving…" : "Save opportunity"}
      </Button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-dark">{label}</label>
      <input
        type={type}
        className="mt-1 w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-dark">{label}</label>
      <textarea
        className="mt-1 w-full rounded-xl border border-soft-border px-4 py-2.5 text-sm"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
