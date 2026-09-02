export function BookMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 12C27.5 7.5 20 6 13 8.5C11 9.2 10 10.6 10 12.6V42.4C10 44.7 12.4 46.2 14.5 45.3C21 42.6 28 43.8 32 48"
        stroke="#2F4C5C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 12C36.5 7.5 44 6 51 8.5C53 9.2 54 10.6 54 12.6V42.4C54 44.7 51.6 46.2 49.5 45.3C43 42.6 36 43.8 32 48"
        stroke="#2F4C5C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 12V48" stroke="#2F4C5C" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M46 4L47.6 8.4L52 10L47.6 11.6L46 16L44.4 11.6L40 10L44.4 8.4L46 4Z"
        fill="#E0883E"
      />
    </svg>
  );
}
