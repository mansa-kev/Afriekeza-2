import { cn } from "@/lib/utils";

type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type PortalDataTableProps<T> = {
  title?: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  dense?: boolean;
  className?: string;
};

export function PortalDataTable<T>({
  title,
  columns,
  rows,
  rowKey,
  emptyMessage = "No records yet.",
  dense,
  className,
}: PortalDataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-header-border bg-white shadow-sm", className)}>
      {title && (
        <div className="border-b border-header-border px-4 py-3">
          <h3 className="text-sm font-semibold text-dark">{title}</h3>
        </div>
      )}
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-left">
            <thead>
              <tr className="border-b border-header-border bg-off-white/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted",
                      dense && "py-2",
                      col.className,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-header-border/70 last:border-0"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-sm text-dark",
                        dense && "py-2 text-[13px]",
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
