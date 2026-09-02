import type { ApiErrorCode } from "@/types/order";

/**
 * Typed error thrown by any OrdersApi implementation.
 * Lets the UI branch on `code` instead of parsing message strings.
 */
export class ApiError extends Error {
  code: ApiErrorCode;

  constructor(code: ApiErrorCode, message?: string) {
    super(message ?? code);
    this.name = "ApiError";
    this.code = code;
  }
}
