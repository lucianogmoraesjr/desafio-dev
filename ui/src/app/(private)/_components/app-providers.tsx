"use client";

import { DashboardProvider } from "@/contexts/dashboard-context";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardProvider>{children}</DashboardProvider>
    </QueryClientProvider>
  );
}
