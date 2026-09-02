import type { OrdersApi } from "@/services/OrdersApi";
import { ApiError } from "@/services/ApiError";
import type {
  ApiErrorCode,
  DetailResponse,
  LookupResponse,
  OrderDetail,
  OrderSummary,
} from "@/types/order";

const REQUEST_TIMEOUT_MS = 12_000;
const CLIENT_ID_STORAGE_KEY = "ijun_client_id";

interface GoogleAppsScriptOrdersApiOptions {
  /** The deployed Apps Script Web App /exec URL. */
  baseUrl: string;
  /** Optional shared secret, also set as CLIENT_TOKEN in Apps Script's
   *  Script Properties. A light deterrent, not real authentication —
   *  it ships in the frontend bundle. */
  clientToken?: string;
}

/** Persists a random per-browser id so the backend can rate-limit per
 *  device rather than lumping every visitor into one shared bucket. */
function getOrCreateClientId(): string {
  try {
    const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (existing) return existing;
    const generated = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall back to a
    // per-session value; rate limiting still applies, just coarser.
    return "session-" + Math.random().toString(36).slice(2);
  }
}

/**
 * Talks to the Google Apps Script Web App deployment (see /backend/Code.gs).
 * Apps Script Web Apps only reliably accept GET and POST with
 * `text/plain` bodies (a real `application/json` POST triggers a CORS
 * preflight that Apps Script does not handle), so requests are sent as
 * POST with a text/plain body containing JSON, which doPost on the
 * Apps Script side parses manually.
 */
export class GoogleAppsScriptOrdersApi implements OrdersApi {
  private readonly baseUrl: string;
  private readonly clientToken?: string;
  private readonly clientId: string;

  constructor(options: GoogleAppsScriptOrdersApiOptions) {
    if (!options.baseUrl) {
      throw new Error("GoogleAppsScriptOrdersApi requires a baseUrl.");
    }
    this.baseUrl = options.baseUrl;
    this.clientToken = options.clientToken;
    this.clientId = getOrCreateClientId();
  }

  async lookupByPhoneLast4(last4: string): Promise<OrderSummary[]> {
    const data = await this.call<LookupResponse>({
      action: "lookup",
      phoneLast4: last4,
    });
    return data.orders;
  }

  async getOrderDetail(orderId: string, last4: string): Promise<OrderDetail> {
    const data = await this.call<DetailResponse>({
      action: "detail",
      orderId,
      phoneLast4: last4,
    });
    // call() throws on ok === false, so `order` is always present here.
    return data.order as OrderDetail;
  }

  private async call<T extends { ok: boolean; error?: ApiErrorCode }>(
    payload: Record<string, string>
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        // text/plain avoids a CORS preflight against Apps Script.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...payload,
          clientId: this.clientId,
          clientToken: this.clientToken,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ApiError("SERVER_ERROR", `HTTP ${response.status}`);
      }

      const data = (await response.json()) as T;
      // Apps Script Web Apps cannot set a custom HTTP status code, so
      // errors are always signaled through the JSON body's `ok`/`error`
      // fields rather than the HTTP status — check it here, once, so
      // every caller can just branch on ApiError.code.
      if (data.ok === false) {
        throw new ApiError(data.error ?? "SERVER_ERROR");
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiError("SERVER_ERROR", "Request timed out.");
      }
      throw new ApiError("SERVER_ERROR", (err as Error).message);
    } finally {
      clearTimeout(timeout);
    }
  }
}
