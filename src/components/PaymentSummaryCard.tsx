import { formatRupiah } from "@/lib/format";
import type { PaymentStatus } from "@/types/order";

interface PaymentSummaryCardProps {
  total: number;
  paid: number;
  remaining: number;
  status: PaymentStatus;
}

const REMAINING_COLOR: Record<PaymentStatus, string> = {
  LUNAS: "text-leaf",
  "SUDAH DP": "text-amberwarn",
  "BELUM BAYAR": "text-brick",
};

export function PaymentSummaryCard({ total, paid, remaining, status }: PaymentSummaryCardProps) {
  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-soft">
      <div className="space-y-2.5 text-[15px]">
        <div className="flex justify-between">
          <span className="text-ink/60">Total Pesanan</span>
          <span className="font-medium text-ink">{formatRupiah(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Sudah Dibayar</span>
          <span className="font-medium text-ink">{formatRupiah(paid)}</span>
        </div>
      </div>

      <div
        className="my-4 border-t border-dashed border-line"
        aria-hidden="true"
      />

      <div className="flex items-end justify-between">
        <span className="text-[15px] text-ink/60">
          {status === "LUNAS" ? "Status" : "Kekurangan"}
        </span>
        {status === "LUNAS" ? (
          <span className="font-display text-2xl font-semibold text-leaf">Lunas ✓</span>
        ) : (
          <span className={`font-display text-3xl font-semibold ${REMAINING_COLOR[status]}`}>
            {formatRupiah(remaining)}
          </span>
        )}
      </div>
    </div>
  );
}
