import { formatRupiah } from "@/lib/format";
import type { OrderItem } from "@/types/order";

export function ProductRow({ item }: { item: OrderItem }) {
  const hasDiscount = typeof item.discountPrice === "number";

  return (
    <div className="flex items-start justify-between gap-3 py-3 print:gap-2 print:py-1.5">
      <div>
        <p className="text-[15px] font-medium text-ink print:text-[10px]">{item.productName}</p>
        <p className="mt-0.5 text-sm text-ink/50 print:text-[9px]">
          {hasDiscount ? (
            <>
              <span className="line-through">{formatRupiah(item.price)}</span>{" "}
              <span className="font-medium text-marigold">
                {formatRupiah(item.discountPrice as number)}
              </span>
            </>
          ) : (
            formatRupiah(item.price)
          )}{" "}
          &times; {item.qty}
        </p>
      </div>
      <p className="whitespace-nowrap text-[15px] font-semibold text-ink print:text-[10px]">
        {formatRupiah(item.subtotal)}
      </p>
    </div>
  );
}
