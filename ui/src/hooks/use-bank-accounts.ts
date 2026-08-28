import { useQuery } from "@tanstack/react-query";

import { getBankAccountsAction } from "@/app/actions/bank-accounts-actions";

export function useBankAccounts() {
  const { data, isFetching } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: () => getBankAccountsAction(),
    staleTime: Infinity,
  });

  return { accounts: data ?? [], isFetching };
}
