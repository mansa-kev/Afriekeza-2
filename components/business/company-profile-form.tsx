"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveCompanyProfile } from "@/lib/actions/portal";

type Company = {
  legal_name?: string;
  trading_name?: string | null;
  registration_number?: string | null;
  sector?: string | null;
  entity_type?: string | null;
  registered_address?: string | null;
  revenue_model?: string | null;
};

export function CompanyProfileForm({ company }: { company?: Company | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [legalName, setLegalName] = useState(company?.legal_name ?? "");
  const [tradingName, setTradingName] = useState(company?.trading_name ?? "");
  const [registrationNumber, setRegistrationNumber] = useState(company?.registration_number ?? "");
  const [sector, setSector] = useState(company?.sector ?? "");
  const [entityType, setEntityType] = useState(company?.entity_type ?? "");
  const [registeredAddress, setRegisteredAddress] = useState(company?.registered_address ?? "");
  const [revenueModel, setRevenueModel] = useState(company?.revenue_model ?? "");

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveCompanyProfile({
        legalName,
        tradingName,
        registrationNumber,
        sector,
        entityType,
        registeredAddress,
        revenueModel,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {[
        ["Legal name", legalName, setLegalName],
        ["Trading name", tradingName, setTradingName],
        ["Registration number", registrationNumber, setRegistrationNumber],
        ["Sector", sector, setSector],
        ["Entity type", entityType, setEntityType],
        ["Registered address", registeredAddress, setRegisteredAddress],
        ["Revenue model", revenueModel, setRevenueModel],
      ].map(([label, value, setter]) => (
        <div key={label as string}>
          <label className="text-sm font-medium text-dark">{label as string}</label>
          <input
            className="mt-1 w-full rounded-xl border border-header-border px-4 py-2.5 text-sm"
            value={value as string}
            onChange={(e) => (setter as (v: string) => void)(e.target.value)}
          />
        </div>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button variant="primary" disabled={pending || !legalName} onClick={handleSave}>
        {pending ? "Saving…" : "Save company profile"}
      </Button>
    </div>
  );
}
