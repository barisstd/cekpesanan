import { formatRupiah } from "@/lib/format";
import type { PaymentStatus } from "@/types/order";

interface PaymentSummaryCardProps {
  subtotalBeforeDiscount: number;
  discountTotal: number;
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

export function PaymentSummaryCard({
  subtotalBeforeDiscount,
  discountTotal,
  total,
  paid,
  remaining,
  status,
}: PaymentSummaryCardProps) {
  const hasDiscount = discountTotal > 0;

  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-soft print:rounded-none print:border-dashed print:p-2 print:shadow-none">
      <div className="space-y-2.5 text-[15px] print:space-y-1 print:text-[10px]">
        {hasDiscount && (
          <>
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal Produk</span>
              <span className="font-medium text-ink">
                {formatRupiah(subtotalBeforeDiscount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Diskon</span>
              <span className="font-medium text-marigold">
                -{formatRupiah(discountTotal)}
              </span>
            </div>
          </>
        )}
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
        className="my-4 border-t border-dashed border-line print:my-2"
        aria-hidden="true"
      />

      <div className="flex items-end justify-between">
        <span className="text-[15px] text-ink/60 print:text-[10px]">
          {status === "LUNAS" ? "Status" : "Kekurangan"}
        </span>
        {status === "LUNAS" ? (
          <span className="font-display text-2xl font-semibold text-leaf print:text-base">
            Lunas ✓
          </span>
        ) : (
          <span
            className={`font-display text-3xl font-semibold print:text-base ${REMAINING_COLOR[status]}`}
          >
            {formatRupiah(remaining)}
          </span>
        )}
      </div>
    </div>
  );
}
