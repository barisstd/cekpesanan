import type { OrdersApi } from "@/services/OrdersApi";
import { GoogleAppsScriptOrdersApi } from "@/services/GoogleAppsScriptOrdersApi";
import { MockOrdersApi } from "@/services/MockOrdersApi";

/**
 * Single wiring point for which backend the app talks to.
 * To point at a different backend later, add a new class that
 * implements OrdersApi and swap it in here — nothing else changes.
 */
function createOrdersApi(): OrdersApi {
  const useMock = import.meta.env.VITE_USE_MOCK_API === "true";
  if (useMock) {
    return new MockOrdersApi();
  }

  const baseUrl = import.meta.env.VITE_APPS_SCRIPT_URL;
  if (!baseUrl) {
    // eslint-disable-next-line no-console
    console.warn(
      "VITE_APPS_SCRIPT_URL is not set — falling back to the mock API. " +
        "Set it in .env (see .env.example) to use the real backend."
    );
    return new MockOrdersApi();
  }

  return new GoogleAppsScriptOrdersApi({
    baseUrl,
    clientToken: import.meta.env.VITE_CLIENT_TOKEN,
  });
}

export const ordersApi: OrdersApi = createOrdersApi();
