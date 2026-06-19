"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setInquiryStatusAction,
  deleteInquiryAction,
} from "@/lib/admin/actions/inquiries";
import type { InquiryStatus } from "@/lib/admin/data/inquiries";

const STATUSES: InquiryStatus[] = [
  "new",
  "reviewed",
  "responded",
  "archived",
  "spam",
];

const LABEL: Record<InquiryStatus, string> = {
  new: "New",
  reviewed: "Mark Reviewed",
  responded: "Mark Responded",
  archived: "Archive",
  spam: "Mark Spam",
};

export function InquiryStatusBar({
  id,
  current,
}: {
  id: string;
  current: InquiryStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(next: InquiryStatus) {
    if (next === current) return;
    startTransition(async () => {
      await setInquiryStatusAction(id, next);
      router.refresh();
    });
  }

  function onDelete() {
    if (!window.confirm("Delete this inquiry permanently? This cannot be undone.")) return;
    startTransition(async () => {
      const res = await deleteInquiryAction(id);
      if (res.ok) router.push("/admin/inquiries");
      else window.alert(res.error);
    });
  }

  return (
    <div className="inqstatusbar">
      <div className="inqstatusbar__group">
        <span className="inqstatusbar__label">Status</span>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending || s === current}
            onClick={() => setStatus(s)}
            className={`adminbtn adminbtn--small ${
              s === current ? "adminbtn--primary" : "adminbtn--ghost"
            }`}
          >
            {s === current ? `Currently ${s}` : LABEL[s]}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        className="adminbtn adminbtn--danger adminbtn--small"
      >
        Delete
      </button>
    </div>
  );
}
