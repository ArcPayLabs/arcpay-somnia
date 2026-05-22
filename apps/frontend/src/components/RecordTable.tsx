"use client";

import { useEffect, useState } from "react";
import { type LocalRecord, readRecords, txUrl } from "@/lib/somnia";

export function RecordTable({ type }: { type?: string }) {
  const [records, setRecords] = useState<LocalRecord[]>([]);

  useEffect(() => {
    setRecords(readRecords().filter((record) => !type || record.type === type));
  }, [type]);

  if (!records.length) return <div className="notice">No records yet.</div>;

  return (
    <div className="table">
      {records.map((record) => (
        <div className="row" key={record.id}>
          <div>
            <strong>{record.title}</strong>
            <br />
            <span className="muted">{new Date(record.createdAt).toLocaleString()}</span>
          </div>
          <div>{record.amount ?? record.type}</div>
          <div>
            <span className="badge">{record.status}</span>
            {record.txHash ? (
              <>
                <br />
                <a className="muted" href={txUrl(record.txHash)} target="_blank" rel="noreferrer">
                  View tx
                </a>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
