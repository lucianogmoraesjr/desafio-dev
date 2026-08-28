import { useContext } from "react";

import { DashboardContext } from "../contexts/dashboard-context";

export function useDashboard() {
  const dashboardContext = useContext(DashboardContext);

  return dashboardContext;
}
