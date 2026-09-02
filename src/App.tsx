import { useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { HomePage } from "@/pages/HomePage";
import { OrderListPage } from "@/pages/OrderListPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useOrderLookup } from "@/hooks/useOrderLookup";

export default function App() {
  const { screen, submitLookup, selectOrder, backToList, reset, retry } = useOrderLookup();

  // Single-match convenience: skip the list screen and go straight to detail.
  const autoForwarded = useRef<string | null>(null);
  useEffect(() => {
    if (screen.name === "list" && screen.orders.length === 1) {
      const orderId = screen.orders[0].orderId;
      if (autoForwarded.current !== orderId) {
        autoForwarded.current = orderId;
        void selectOrder(orderId);
      }
    }
  }, [screen, selectOrder]);

  return (
    <AppShell>
      {renderScreen()}
    </AppShell>
  );

  function renderScreen() {
    switch (screen.name) {
      case "home":
        return <HomePage onSubmit={submitLookup} />;

      case "loading-lookup":
        return <LoadingState message="Mencari pesanan kamu..." />;

      case "list":
        if (screen.orders.length === 1) {
          // Auto-forwarding to detail; avoid flashing the list UI.
          return <LoadingState message="Membuka pesanan kamu..." />;
        }
        return (
          <OrderListPage orders={screen.orders} onSelect={selectOrder} onBack={reset} />
        );

      case "loading-detail":
        return <LoadingState message="Mengambil detail pesanan..." />;

      case "detail":
        return (
          <OrderDetailPage
            order={screen.order}
            showBack={screen.orders.length > 1}
            onBack={screen.orders.length > 1 ? backToList : reset}
          />
        );

      case "error":
        return (
          <ErrorState
            code={screen.code}
            retryAfterMs={screen.retryAfterMs}
            onRetry={() => {
              if (screen.code === "NOT_FOUND" || screen.code === "INVALID_INPUT") {
                reset();
              } else {
                retry(screen.last4);
              }
            }}
          />
        );

      default:
        return null;
    }
  }
}
