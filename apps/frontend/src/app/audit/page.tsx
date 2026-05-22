"use client";

import { PageHeader } from "@/components/PageHeader";
import { RecordTable } from "@/components/RecordTable";

export default function AuditPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operator evidence"
        title="Audit trail"
        description="ArcPay logs local workflow records and attaches transaction hashes when a Somnia wallet action or contract mutation succeeds."
        badges={["Transaction hashes", "Local workflow events", "Judge-readable"]}
      />
      <section className="grid section">
        <div className="panel full">
          <h2>All records</h2>
          <RecordTable />
        </div>
      </section>
    </>
  );
}
