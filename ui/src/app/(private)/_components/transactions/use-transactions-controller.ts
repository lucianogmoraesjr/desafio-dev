import { useEffect, useState } from "react";
import Swiper from "swiper";

import { TransactionsFilters } from "@/app/actions/transactions-actions";
import { useDashboard } from "@/hooks/use-dashboard";
import { useTransactions } from "@/hooks/use-transactions";

export function useTransactionsController() {
  const [slideState, setSlideState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const [filters, setFilters] = useState<TransactionsFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const { valuesVisible: areValuesVisible } = useDashboard();

  const { transactions, isLoading, isInitialLoading, refetchTransactions } =
    useTransactions(filters);

  useEffect(() => {
    refetchTransactions();
  }, [filters, refetchTransactions]);

  function handleChangeFilters<T extends keyof TransactionsFilters>(filter: T) {
    return (value: TransactionsFilters[T]) => {
      if (value === filters[filter]) return;

      setFilters((prevState) => ({
        ...prevState,
        [filter]: value,
      }));
    };
  }

  function handleApplyFilters({
    bankAccountId,
    year,
  }: {
    bankAccountId: string | undefined;
    year: number;
  }) {
    handleChangeFilters("bankAccountId")(bankAccountId);
    handleChangeFilters("year")(year);
  }

  function handleIndexChange(swiper: Swiper) {
    setSlideState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }

  return {
    handleIndexChange,
    handleChangeFilters,
    handleApplyFilters,
    slideState,
    areValuesVisible,
    isLoading,
    isInitialLoading,
    transactions,
    filters,
  };
}
