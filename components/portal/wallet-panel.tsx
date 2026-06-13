"use client";

type Transaction = {
  id: string;
  type: string;
  amount_kes: number;
  reference: string | null;
  status: string;
  created_at: string;
};

export function WalletStatement({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-sm text-muted">No wallet activity yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-header-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-header-border text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-header-border last:border-0">
              <td className="px-4 py-3 text-muted">{new Date(tx.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 capitalize">{tx.type.replaceAll("_", " ")}</td>
              <td className="px-4 py-3 font-medium">KES {Number(tx.amount_kes).toLocaleString()}</td>
              <td className="px-4 py-3 text-muted">{tx.reference ?? "—"}</td>
              <td className="px-4 py-3 capitalize">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
