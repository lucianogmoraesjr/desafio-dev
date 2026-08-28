import { useMemo, useState } from "react";
import Swiper from "swiper";

import { useBankAccounts } from "../../../../hooks/use-bank-accounts";
import { useDashboard } from "../../../../hooks/use-dashboard";
import { useWindowWidth } from "@/hooks/use-window-width";

export function useAccountsController() {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [sliderState, setSliderState] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const windowWidth = useWindowWidth();

  const { toggleValuesVisibility, valuesVisible: areValuesVisible } =
    useDashboard();

  function handleSlideChange(swiper: Swiper) {
    setSliderState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }

  const { accounts, isFetching } = useBankAccounts();

  const totalCurrentBalance = useMemo(() => {
    return accounts.reduce(
      (total, { currentBalanceInCents }) => total + currentBalanceInCents,
      0,
    );
  }, [accounts]);

  return {
    sliderState,
    windowWidth,
    areValuesVisible,
    isLoading: isFetching,
    accounts,
    totalCurrentBalance,
    accountDialogOpen,
    setAccountDialogOpen,
    setSliderState,
    handleSlideChange,
    toggleValuesVisibility,
  };
}
