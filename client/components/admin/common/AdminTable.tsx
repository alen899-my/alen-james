import React from 'react';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export default function AdminTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "No data found",
  emptyIcon,
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e8e2d5] shadow-sm">
        {emptyIcon && (
          <div className="mb-4 text-[#aab4be]">{emptyIcon}</div>
        )}
        <p className="text-base font-medium text-[#8b9aaa]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[#e8e2d5] bg-white shadow-sm overflow-hidden">
      {/* Scrollable wrapper — horizontal scroll on small screens */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#e8e2d5] scrollbar-track-transparent">
        <table className="w-full min-w-[640px] text-left border-collapse">

          {/* ── Cream header ── */}
          <thead>
            <tr
              style={{
                background: 'linear-gradient(to bottom, #fdf9f2, #f5f0e6)',
              }}
              className="border-b-2 border-[#e0d8cc]"
            >
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={[
                    'px-5 py-3.5',
                    'text-[11px] font-semibold uppercase tracking-widest',
                    'text-[#7a8999]',
                    'whitespace-nowrap',
                    'first:rounded-tl-2xl last:rounded-tr-2xl',
                    col.className ?? '',
                  ].join(' ')}
                >
                  {/* Thin ocean-blue accent bar on first header cell */}
                  {idx === 0 ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-0.5 h-3.5 rounded-full"
                        style={{ background: '#1084a2' }}
                      />
                      {col.header}
                    </span>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body rows ── */}
          <tbody>
            {data.map((item, rowIdx) => (
              <tr
                key={String(item[keyField])}
                className={[
                  'border-b border-[#f0ebe0] last:border-0',
                  'transition-colors duration-150',
                  'hover:bg-[#faf7f0]',
                  rowIdx % 2 === 1 ? 'bg-[#fdfbf7]' : 'bg-white',
                ].join(' ')}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={[
                      'px-5 py-3.5',
                      'text-sm text-[#1a1a1a]',
                      'align-middle',
                      col.className ?? '',
                    ].join(' ')}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}