import { formatRupiah } from "@/lib/format";
import type { OrderItem } from "@/types/order";

export function ProductRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-[15px] font-medium text-ink">{item.productName}</p>
        <p className="mt-0.5 text-sm text-ink/50">
          {formatRupiah(item.price)} &times; {item.qty}
        </p>
      </div>
      <p className="whitespace-nowrap text-[15px] font-semibold text-ink">
        {formatRupiah(item.subtotal)}
      </p>
    </div>
  );
}
