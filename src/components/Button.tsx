import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-marigold text-white shadow-soft hover:bg-marigold-dark active:bg-marigold-dark disabled:bg-marigold/50",
  secondary:
    "bg-cloth text-white shadow-soft hover:bg-cloth-dark active:bg-cloth-dark disabled:bg-cloth/50",
  outline:
    "bg-transparent text-cloth border border-cloth/30 hover:bg-cloth/5 active:bg-cloth/10 disabled:opacity-50",
  ghost: "bg-transparent text-cloth hover:bg-cloth/5 active:bg-cloth/10 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5",
        "text-[15px] font-semibold tracking-tight transition-colors duration-150",
        "disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantClasses[variant],
        className,
      ].join(" ")}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {children}
    </button>
  );
}
