// Reusable white wordmark + dome icon for surfaces where the dark PNG logo
// doesn't read (auth shell, admin header). Uses currentColor so it renders
// in whatever text color the parent sets — by default, white on navy.

export function BrandMark({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? 48 : size === "md" ? 40 : 32;
  const eyebrowSize = size === "lg" ? 11 : size === "md" ? 10 : 9;
  const wordSize = size === "lg" ? 22 : size === "md" ? 18 : 15;

  return (
    <span
      className={`brandmark${className ? ` ${className}` : ""}`}
      aria-label="The Haney Group"
      style={{ display: "inline-flex", alignItems: "center", gap: 12 }}
    >
      <svg
        viewBox="0 0 64 64"
        width={dim}
        height={dim}
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0, color: "currentColor" }}
      >
        <g
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="32" y1="6" x2="32" y2="10" />
          <circle cx="32" cy="11.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M18 32c0-9 6-15 14-15s14 6 14 15" />
          <path d="M22 32c0-7 4.5-12 10-12s10 5 10 12" />
          <line x1="14" y1="33" x2="50" y2="33" />
          <line x1="14" y1="36" x2="50" y2="36" />
          <line x1="18" y1="36" x2="18" y2="52" />
          <line x1="24" y1="36" x2="24" y2="52" />
          <line x1="32" y1="36" x2="32" y2="52" />
          <line x1="40" y1="36" x2="40" y2="52" />
          <line x1="46" y1="36" x2="46" y2="52" />
          <line x1="12" y1="52" x2="52" y2="52" />
          <line x1="10" y1="55" x2="54" y2="55" />
          <line x1="8" y1="58" x2="56" y2="58" />
        </g>
      </svg>
      <span
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 2,
          lineHeight: 1.15,
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: `${eyebrowSize}px`,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--amber-400)",
            fontWeight: 700,
          }}
        >
          The Haney Group
        </span>
        <span
          style={{
            fontSize: `${wordSize}px`,
            fontWeight: 700,
            color: "currentColor",
            letterSpacing: "-0.005em",
          }}
        >
          Site Admin
        </span>
      </span>
    </span>
  );
}
