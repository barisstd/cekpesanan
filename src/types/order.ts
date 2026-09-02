/**
 * Domain types shared across the API service layer and UI.
 * These mirror what the Apps Script backend returns — NOT the raw
 * Google Sheets rows. The backend never sends the full phone number
 * or any admin-only fields; that filtering happens server-side.
 */

export type PaymentStatus = "LUNAS" | "SUDAH DP" | "BELUM BAYAR";

export type OrderStatus =
  | "Diproses"
  | "Dikemas"
  | "Dikirim"
  | "Selesai"
  | "Dibatalkan"
  | string; // fallback: backend is the source of truth for status labels

export interface OrderSummary {
  orderId: string;
  orderDate: string; // ISO 8601
  customerName: string;
  phoneLast4: string;
  shippingMethod: string;
  orderStatus: OrderStatus;
  total: number;
  paid: number;
  remaining: number;
  paymentStatus: PaymentStatus;
}

export interface OrderItem {
  productName: string;
  price: number;
  qty: number;
  subtotal: number;
}

export interface Payment {
  paymentId: string;
  paymentDate: string; // ISO 8601
  amount: number;
  method: string;
  status: string;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  payments: Payment[];
}

/** Raw shape returned by the Apps Script `lookup` action. */
export interface LookupResponse {
  ok: boolean;
  orders: OrderSummary[];
  error?: ApiErrorCode;
}

/** Raw shape returned by the Apps Script `detail` action. */
export interface DetailResponse {
  ok: boolean;
  order?: OrderDetail;
  error?: ApiErrorCode;
}

export type ApiErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR";
