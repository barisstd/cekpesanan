import { ScreenHeader } from "@/components/ScreenHeader";
import { OrderListCard } from "@/components/OrderListCard";
import type { OrderSummary } from "@/types/order";

interface OrderListPageProps {
  orders: OrderSummary[];
  onSelect: (orderId: string) => void;
  onBack: () => void;
}

export function OrderListPage({ orders, onSelect, onBack }: OrderListPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <ScreenHeader title="Pesanan Kamu" onBack={onBack} backLabel="Cari nomor lain" />
      <p className="mb-5 text-sm text-ink/60">
        Ditemukan {orders.length} pesanan. Pilih salah satu untuk lihat detailnya.
      </p>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderListCard key={order.orderId} order={order} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
