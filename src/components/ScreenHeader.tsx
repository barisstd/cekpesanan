interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  backLabel?: string;
}

export function ScreenHeader({ title, onBack, backLabel = "Kembali" }: ScreenHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-3 print:hidden">
      <button
        onClick={onBack}
        aria-label={backLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors active:bg-line/50"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M11 3.5L5 9L11 14.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
    </div>
  );
}
