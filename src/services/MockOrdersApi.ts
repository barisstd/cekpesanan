import type { OrdersApi } from "@/services/OrdersApi";
import { ApiError } from "@/services/ApiError";
import type { OrderDetail, OrderSummary } from "@/types/order";

/**
 * In-memory fake used for local development and design review
 * (`VITE_USE_MOCK_API=true`) so the UI can be built and tested
 * without a live Apps Script deployment. Mirrors the same
 * validation and error shapes the real backend enforces.
 */

interface MockOrderRecord extends OrderDetail {
  fullPhone: string;
}

const MOCK_ORDERS: MockOrderRecord[] = [
  {
    orderId: "IJN-1042",
    orderDate: "2026-08-24T03:00:00.000Z",
    customerName: "Ratna Sari",
    phoneLast4: "8231",
    fullPhone: "081234568231",
    shippingMethod: "JNE Reguler",
    orderStatus: "Dikirim",
    total: 287000,
    paid: 150000,
    remaining: 137000,
    paymentStatus: "SUDAH DP",
    items: [
      { productName: "Seri Kisah 25 Nabi (Boardbook)", price: 149000, qty: 1, subtotal: 149000 },
      { productName: "Buku Aktivitas Muslim Cilik", price: 69000, qty: 2, subtotal: 138000 },
    ],
    payments: [
      { paymentId: "PAY-2201", paymentDate: "2026-08-24T04:10:00.000Z", amount: 150000, method: "Transfer BCA", status: "Diterima" },
    ],
  },
  {
    orderId: "IJN-1043",
    orderDate: "2026-08-27T09:15:00.000Z",
    customerName: "Ratna Sari",
    phoneLast4: "8231",
    fullPhone: "081234568231",
    shippingMethod: "Ambil di toko",
    orderStatus: "Selesai",
    total: 89000,
    paid: 89000,
    remaining: 0,
    paymentStatus: "LUNAS",
    items: [{ productName: "Buku Doa Anak Bergambar", price: 89000, qty: 1, subtotal: 89000 }],
    payments: [
      { paymentId: "PAY-2214", paymentDate: "2026-08-27T09:20:00.000Z", amount: 89000, method: "COD", status: "Diterima" },
    ],
  },
  {
    orderId: "IJN-1050",
    orderDate: "2026-08-30T11:00:00.000Z",
    customerName: "Budi Hartono",
    phoneLast4: "5567",
    fullPhone: "081298765567",
    shippingMethod: "SiCepat",
    orderStatus: "Diproses",
    total: 198000,
    paid: 0,
    remaining: 198000,
    paymentStatus: "BELUM BAYAR",
    items: [{ productName: "Paket Buku Cerita Anak (isi 5)", price: 198000, qty: 1, subtotal: 198000 }],
    payments: [],
  },
];

function toSummary(record: MockOrderRecord): OrderSummary {
  const { fullPhone: _fullPhone, items: _items, payments: _payments, ...summary } = record;
  return summary;
}

function simulateLatency(ms = 550): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockOrdersApi implements OrdersApi {
  async lookupByPhoneLast4(last4: string): Promise<OrderSummary[]> {
    await simulateLatency();

    if (!/^\d{4}$/.test(last4)) {
      throw new ApiError("INVALID_INPUT");
    }

    const matches = MOCK_ORDERS.filter((o) => o.fullPhone.slice(-4) === last4);
    if (matches.length === 0) {
      throw new ApiError("NOT_FOUND");
    }
    return matches.map(toSummary);
  }

  async getOrderDetail(orderId: string, last4: string): Promise<OrderDetail> {
    await simulateLatency(400);

    const record = MOCK_ORDERS.find(
      (o) => o.orderId === orderId && o.fullPhone.slice(-4) === last4
    );
    if (!record) {
      throw new ApiError("NOT_FOUND");
    }
    const { fullPhone: _fullPhone, ...detail } = record;
    return detail;
  }
}
