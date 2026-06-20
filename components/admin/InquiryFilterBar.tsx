"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

const STATUSES: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "responded", label: "Responded" },
  { value: "archived", label: "Archived" },
  { value: "spam", label: "Spam" },
];

export function InquiryFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const currentStatus = params.get("status") ?? "all";
  const [q, setQ] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    router.push(`/admin/inquiries?${next.toString()}`);
  }

  function setStatus(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete("status");
    else next.set("status", value);
    router.push(`/admin/inquiries?${next.toString()}`);
  }

  return (
    <div className="inqfilter">
      <div className="inqfilter__pills" role="tablist" aria-label="Filter by status">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            role="tab"
            aria-selected={currentStatus === s.value}
            className={`inqfilter__pill${
              currentStatus === s.value ? " is-active" : ""
            }`}
            onClick={() => setStatus(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="inqfilter__search">
        <input
          type="search"
          placeholder="Search name, email, organization, or message…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="adminfield__input"
        />
        <button type="submit" className="adminbtn adminbtn--ghost adminbtn--small">
          Search
        </button>
      </form>
    </div>
  );
}
