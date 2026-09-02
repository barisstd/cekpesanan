import type { ReactNode } from "react";
import { BrandHeader } from "@/components/BrandHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
        <BrandHeader />
        {children}
      </div>
    </div>
  );
}
