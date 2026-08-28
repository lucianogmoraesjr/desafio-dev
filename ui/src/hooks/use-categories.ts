import { getCategoriesAction } from "@/app/actions/categories-actions";
import { useQuery } from "@tanstack/react-query";

export function useCategories(type?: "EXPENSE" | "INCOME") {
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategoriesAction(type),
  });

  return {
    categories: data ?? [],
    isLoading: isFetching,
    isInitialLoading: isLoading,
    refetchCategories: refetch,
  };
}
