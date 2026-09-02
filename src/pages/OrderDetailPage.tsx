import { useState } from "react";
import { ScreenHeader } from "@/components/ScreenHeader";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { ProductRow } from "@/components/ProductRow";
import { PaymentSummaryCard } from "@/components/PaymentSummaryCard";
import { PaymentAccountsPanel } from "@/components/PaymentAccountsPanel";
import { Button } from "@/components/Button";
import { formatOrderDate } from "@/lib/format";
import type { OrderDetail } from "@/types/order";

interface OrderDetailPageProps {
  order: OrderDetail;
  onBack: () => void;
  showBack: boolean;
}

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "6281234567890";

export function OrderDetailPage({ order, onBack, showBack }: OrderDetailPageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const isUnpaid = order.paymentStatus !== "LUNAS";

  const waMessage = encodeURIComponent(
    `Halo Admin Ijun Bookstore, saya mau tanya soal pesanan ${order.orderId} (${order.customerName}).`
  );
  const waHref = `https://wa.me/${ADMIN_WHATSAPP}?text=${waMessage}`;

  return (
    <div className="flex flex-1 flex-col">
      {showBack ? (
        <ScreenHeader title="Detail Pesanan" onBack={onBack} backLabel="Daftar pesanan" />
      ) : (
        <ScreenHeader title="Detail Pesanan" onBack={onBack} backLabel="Cari nomor lain" />
      )}

      <div className="flex flex-col gap-5 print:gap-4">
        {/* Order identity */}
        <div className="rounded-card border border-line bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold text-ink">{order.orderId}</p>
              <p className="mt-0.5 text-sm text-ink/60">{formatOrderDate(order.orderDate)}</p>
            </div>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/50">Nama</span>
              <span className="font-medium text-ink">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Pengiriman</span>
              <span className="font-medium text-ink">{order.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">Status Pesanan</span>
              <span className="font-medium text-ink">{order.orderStatus}</span>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="rounded-card border border-line bg-white p-5 shadow-soft">
          <p className="mb-1 text-sm font-medium text-ink/70">Produk</p>
          <div className="divide-y divide-line">
            {order.items.map((item, i) => (
              <ProductRow key={`${item.productName}-${i}`} item={item} />
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <PaymentSummaryCard
          total={order.total}
          paid={order.paid}
          remaining={order.remaining}
          status={order.paymentStatus}
        />

        {/* Bayar Sekarang — only shown while there's a balance owing */}
        {isUnpaid && (
          <div className="flex flex-col gap-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowPayment((s) => !s)}
              className="print:hidden"
            >
              {showPayment ? "Sembunyikan Info Transfer" : "Bayar Sekarang"}
            </Button>
            {showPayment && <PaymentAccountsPanel />}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3 pb-2 print:hidden">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => window.open(waHref, "_blank", "noopener,noreferrer")}
          >
            Hubungi Admin
          </Button>
          <Button variant="outline" fullWidth onClick={() => window.print()}>
            Cetak Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
