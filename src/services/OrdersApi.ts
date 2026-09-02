import type { OrderDetail, OrderSummary } from "@/types/order";

/**
 * Contract the UI codes against. Swap the Google Apps Script backend
 * for anything else (a Node API, Firebase, etc.) by writing a new
 * class that implements this interface — no component changes needed.
 */
export interface OrdersApi {
  /**
   * Looks up orders by the last 4 digits of the phone number used
   * when placing the order. Throws ApiError on invalid input,
   * not-found, rate-limit, or server failure.
   */
  lookupByPhoneLast4(last4: string): Promise<OrderSummary[]>;

  /**
   * Fetches the full detail (items + payments) for a single order.
   * The caller must also pass the same last4 used for lookup, so the
   * backend can re-verify the requester is entitled to see this order.
   */
  getOrderDetail(orderId: string, last4: string): Promise<OrderDetail>;
}
