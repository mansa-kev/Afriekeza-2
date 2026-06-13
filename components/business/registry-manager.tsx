"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveCapTableEntry, saveEsopPool } from "@/lib/actions/operational";

type CapEntry = {
  id: string;
  holder_name: string;
  share_class: string;
  units: number;
  ownership_pct: number | null;
};

type EsopPool = {
  id: string;
  pool_name: string;
  allocated_units: number;
  reserved_units: number;
};

export function RegistryManager({
  companyId,
  capTable,
  esopPools,
}: {
  companyId: string;
  capTable: CapEntry[];
  esopPools: EsopPool[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [holderName, setHolderName] = useState("");
  const [shareClass, setShareClass] = useState("Ordinary");
  const [units, setUnits] = useState("");
  const [ownershipPct, setOwnershipPct] = useState("");

  const [poolName, setPoolName] = useState("");
  const [allocated, setAllocated] = useState("");
  const [reserved, setReserved] = useState("");

  function exportCapTableCsv() {
    const header = "Holder,Share Class,Units,Ownership %";
    const rows = capTable.map(
      (e) =>
        `"${e.holder_name}","${e.share_class}",${e.units},${e.ownership_pct ?? ""}`,
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cap-table.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addCapEntry() {
    startTransition(async () => {
      await saveCapTableEntry({
        companyId,
        holderName,
        shareClass,
        units: Number(units),
        ownershipPct: ownershipPct ? Number(ownershipPct) : undefined,
      });
      setHolderName("");
      setUnits("");
      setOwnershipPct("");
      router.refresh();
    });
  }

  function addEsopPool() {
    startTransition(async () => {
      await saveEsopPool({
        companyId,
        poolName,
        allocatedUnits: Number(allocated),
        reservedUnits: Number(reserved),
      });
      setPoolName("");
      setAllocated("");
      setReserved("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-dark">Cap table</h2>
          <Button variant="outline" size="sm" onClick={exportCapTableCsv} disabled={capTable.length === 0}>
            Export CSV
          </Button>
        </div>
        <div className="rounded-2xl border border-header-border bg-white p-6 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Holder name" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={holderName} onChange={(e) => setHolderName(e.target.value)} />
            <input placeholder="Share class" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={shareClass} onChange={(e) => setShareClass(e.target.value)} />
            <input type="number" placeholder="Units" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={units} onChange={(e) => setUnits(e.target.value)} />
            <input type="number" placeholder="Ownership %" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={ownershipPct} onChange={(e) => setOwnershipPct(e.target.value)} />
          </div>
          <Button variant="primary" disabled={pending || !holderName} onClick={addCapEntry}>Add shareholder</Button>
        </div>
        <ul className="mt-4 space-y-2">
          {capTable.map((e) => (
            <li key={e.id} className="rounded-xl border border-header-border bg-white px-4 py-3 text-sm">
              <span className="font-medium text-dark">{e.holder_name}</span>
              <span className="text-muted"> · {e.share_class} · {Number(e.units).toLocaleString()} units</span>
              {e.ownership_pct != null ? <span className="text-muted"> · {e.ownership_pct}%</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-dark">ESOP pools</h2>
        <div className="rounded-2xl border border-header-border bg-white p-6 space-y-3">
          <input placeholder="Pool name" className="w-full rounded-xl border border-header-border px-4 py-2.5 text-sm" value={poolName} onChange={(e) => setPoolName(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="number" placeholder="Allocated units" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={allocated} onChange={(e) => setAllocated(e.target.value)} />
            <input type="number" placeholder="Reserved units" className="rounded-xl border border-header-border px-4 py-2.5 text-sm" value={reserved} onChange={(e) => setReserved(e.target.value)} />
          </div>
          <Button variant="primary" disabled={pending || !poolName} onClick={addEsopPool}>Add ESOP pool</Button>
        </div>
        <ul className="mt-4 space-y-2">
          {esopPools.map((p) => (
            <li key={p.id} className="rounded-xl border border-header-border bg-white px-4 py-3 text-sm">
              <span className="font-medium text-dark">{p.pool_name}</span>
              <span className="text-muted"> · Allocated {Number(p.allocated_units).toLocaleString()} · Reserved {Number(p.reserved_units).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
