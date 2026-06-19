import Link from "next/link";

export function EntityListEmpty({
  message,
  newHref,
  newLabel,
}: {
  message: string;
  newHref: string;
  newLabel: string;
}) {
  return (
    <div className="admintable">
      <div className="admintable__empty">
        <p style={{ marginBottom: 16 }}>{message}</p>
        <Link href={newHref} className="adminbtn adminbtn--primary">
          {newLabel}
        </Link>
      </div>
    </div>
  );
}
