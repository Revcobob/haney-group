export function ComingSoon({
  eyebrow,
  title,
  body,
  phase,
}: {
  eyebrow: string;
  title: string;
  body: string;
  phase: string;
}) {
  return (
    <>
      <div className="admin__pagehead">
        <p className="admin__pagehead-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
      <div className="admin__notice admin__notice--info">
        <div>
          <strong>Coming in {phase}.</strong>
          <p>
            This screen is wired into the navigation but the editing UI lands in
            a later phase. The schema is already in Supabase so data added later
            shows up here without a migration.
          </p>
        </div>
      </div>
    </>
  );
}
