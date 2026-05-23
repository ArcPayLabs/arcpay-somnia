"use client";

import { useEffect, useState } from "react";
import { readRecords, shortAddress, type LocalRecord } from "@somnia/lib/somnia";

export function RecordTable({ type }: { readonly type?: LocalRecord["type"] }) {
  const [records, setRecords] = useState<LocalRecord[]>([]);

  useEffect(() => {
    const rows = readRecords();
    setRecords(type ? rows.filter((record) => record.type === type) : rows);
  }, [type]);

  if (!records.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No records yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {records.map((record) => (
        <div key={record.id} className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="font-medium">{record.title}</div>
            <div className="text-xs text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-sm text-muted-foreground">{record.amount ?? record.type}</div>
          <div className="text-sm">
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">{record.status}</span>
            {record.txHash ? <code className="ml-2 text-xs text-muted-foreground">{shortAddress(record.txHash)}</code> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
