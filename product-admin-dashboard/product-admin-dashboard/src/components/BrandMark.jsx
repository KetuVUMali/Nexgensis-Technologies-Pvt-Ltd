// Small logo: a price tag. Used in the sidebar and on the login page.
export default function BrandMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="#0b7a6b" />
      <g transform="rotate(-14 32 32)">
        <rect x="12" y="20" width="40" height="26" rx="6" fill="#ffffff" />
        <circle cx="20" cy="33" r="3.2" fill="#0b7a6b" />
        <rect x="27" y="29" width="17" height="4" rx="2" fill="#e8a317" />
        <rect x="27" y="36" width="11" height="4" rx="2" fill="#9fcfc6" />
      </g>
    </svg>
  );
}
