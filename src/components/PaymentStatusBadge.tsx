import type { PaymentStatus } from "@/types/order";

const STYLES: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
  LUNAS: { bg: "bg-leaf-light", text: "text-leaf", label: "Lunas" },
  "SUDAH DP": { bg: "bg-amberwarn-light", text: "text-amberwarn", label: "Sudah DP" },
  "BELUM BAYAR": { bg: "bg-brick-light", text: "text-brick", label: "Belum Bayar" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
        style.bg,
        style.text,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {style.label}
    </span>
  );
}
