import { useCallback, useReducer, useRef } from "react";
import { ordersApi } from "@/services/ordersApiInstance";
import { ApiError } from "@/services/ApiError";
import { checkThrottle, recordAttempt } from "@/lib/rateLimit";
import type { ApiErrorCode, OrderDetail, OrderSummary } from "@/types/order";

type Screen =
  | { name: "home" }
  | { name: "loading-lookup"; last4: string }
  | { name: "list"; last4: string; orders: OrderSummary[] }
  | { name: "loading-detail"; last4: string; orders: OrderSummary[] }
  | { name: "detail"; last4: string; orders: OrderSummary[]; order: OrderDetail }
  | { name: "error"; code: ApiErrorCode | "CLIENT_THROTTLED"; last4: string; retryAfterMs?: number };

type Action =
  | { type: "SUBMIT"; last4: string }
  | { type: "LOOKUP_SUCCESS"; orders: OrderSummary[] }
  | { type: "LOOKUP_ERROR"; code: ApiErrorCode }
  | { type: "THROTTLED"; last4: string; retryAfterMs: number }
  | { type: "SELECT_ORDER"; orderId: string }
  | { type: "DETAIL_SUCCESS"; order: OrderDetail }
  | { type: "DETAIL_ERROR"; code: ApiErrorCode }
  | { type: "BACK_TO_LIST" }
  | { type: "RESET" };

function reducer(state: Screen, action: Action): Screen {
  switch (action.type) {
    case "SUBMIT":
      return { name: "loading-lookup", last4: action.last4 };
    case "LOOKUP_SUCCESS": {
      if (state.name !== "loading-lookup") return state;
      // Single match: skip the list and go straight to it being "selectable"
      // — still land on the list screen so the flow (and back button) stays
      // consistent, list UI auto-forwards when there's exactly one order.
      return { name: "list", last4: state.last4, orders: action.orders };
    }
    case "LOOKUP_ERROR": {
      if (state.name !== "loading-lookup") return state;
      return { name: "error", code: action.code, last4: state.last4 };
    }
    case "THROTTLED":
      return { name: "error", code: "CLIENT_THROTTLED", last4: action.last4, retryAfterMs: action.retryAfterMs };
    case "SELECT_ORDER": {
      if (state.name !== "list") return state;
      return { name: "loading-detail", last4: state.last4, orders: state.orders };
    }
    case "DETAIL_SUCCESS": {
      if (state.name !== "loading-detail") return state;
      return { name: "detail", last4: state.last4, orders: state.orders, order: action.order };
    }
    case "DETAIL_ERROR": {
      if (state.name !== "loading-detail") return state;
      return { name: "error", code: action.code, last4: state.last4 };
    }
    case "BACK_TO_LIST": {
      if (state.name !== "detail") return state;
      return { name: "list", last4: state.last4, orders: state.orders };
    }
    case "RESET":
      return { name: "home" };
    default:
      return state;
  }
}

export function useOrderLookup() {
  const [screen, dispatch] = useReducer(reducer, { name: "home" });
  // Tracks which orderId is being fetched so SELECT_ORDER can find it after DETAIL_SUCCESS.
  const pendingOrderId = useRef<string | null>(null);

  const submitLookup = useCallback(async (last4: string) => {
    const throttle = checkThrottle();
    if (!throttle.allowed) {
      dispatch({ type: "THROTTLED", last4, retryAfterMs: throttle.retryAfterMs });
      return;
    }

    dispatch({ type: "SUBMIT", last4 });
    recordAttempt();
    try {
      const orders = await ordersApi.lookupByPhoneLast4(last4);
      dispatch({ type: "LOOKUP_SUCCESS", orders });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "SERVER_ERROR";
      dispatch({ type: "LOOKUP_ERROR", code });
    }
  }, []);

  const selectOrder = useCallback(
    async (orderId: string) => {
      if (screen.name !== "list") return;
      pendingOrderId.current = orderId;
      dispatch({ type: "SELECT_ORDER", orderId });
      try {
        const order = await ordersApi.getOrderDetail(orderId, screen.last4);
        dispatch({ type: "DETAIL_SUCCESS", order });
      } catch (err) {
        const code = err instanceof ApiError ? err.code : "SERVER_ERROR";
        dispatch({ type: "DETAIL_ERROR", code });
      }
    },
    [screen]
  );

  const backToList = useCallback(() => dispatch({ type: "BACK_TO_LIST" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const retry = useCallback(
    (last4: string) => {
      void submitLookup(last4);
    },
    [submitLookup]
  );

  return { screen, submitLookup, selectOrder, backToList, reset, retry };
}
