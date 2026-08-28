import {
  getTransactionsAction,
  TransactionsFilters,
} from "@/app/actions/transactions-actions";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(filters: TransactionsFilters) {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactionsAction(filters),
  });

  return {
    transactions: data ?? [],
    isLoading: isFetching,
    isInitialLoading: isLoading,
    refetchTransactions: refetch,
  };
}
