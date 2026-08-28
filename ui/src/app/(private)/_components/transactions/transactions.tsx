"use client";

import { Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import { MONTHS } from "@/config/constants";
import { SliderOption } from "./slider-option";
import { useTransactionsController } from "./use-transactions-controller";
import { TransactionTypeDropdown } from "./transaction-type-dropdown";
import { SliderNavigation } from "./slider-navigation";
import { FiltersDialog } from "./filters-dialog";
import { TransactionCard } from "./transaction-card";

export function Transactions() {
  const {
    handleIndexChange,
    handleChangeFilters,
    handleApplyFilters,
    slideState: { isBeginning, isEnd },
    areValuesVisible,
    isLoading,
    isInitialLoading,
    transactions,
    filters,
  } = useTransactionsController();

  const hasTransactions = transactions.length > 0;

  return (
    <section className="w-full lg:w-1/2">
      <div className="flex h-full w-full flex-col rounded-2xl bg-accent p-10">
        {isInitialLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="animate-spin size-10" />
          </div>
        )}

        {!isInitialLoading && (
          <>
            <header>
              <div className="flex items-center justify-between">
                <TransactionTypeDropdown
                  onSelect={handleChangeFilters("type")}
                  selectedType={filters.type}
                />

                <FiltersDialog onApplyFilters={handleApplyFilters} />
              </div>

              <div className="relative mt-6">
                <Swiper
                  slidesPerView={3}
                  centeredSlides
                  initialSlide={new Date().getMonth()}
                  onRealIndexChange={handleIndexChange}
                  onSlideChange={({ realIndex }) => {
                    handleChangeFilters("month")(realIndex);
                  }}
                >
                  <SliderNavigation isBeginning={isBeginning} isEnd={isEnd} />

                  {MONTHS.map((month, index) => (
                    <SwiperSlide key={month}>
                      {({ isActive }) => (
                        <SliderOption
                          isActive={isActive}
                          month={month}
                          index={index}
                        />
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </header>

            <section className="mt-4 flex-1 space-y-2 overflow-y-auto ">
              {isLoading && (
                <div className="flex h-full flex-col items-center justify-center">
                  <Loader2 className="animate-spin size-10" />
                </div>
              )}

              {!hasTransactions && !isLoading && (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <Image
                    src="/empty-state.svg"
                    alt="Lista vazia"
                    width={160}
                    height={160}
                  />
                  <span className="text-center text-gray-700">
                    Não encontramos nenhuma transação!
                  </span>
                </div>
              )}

              {hasTransactions &&
                !isLoading &&
                transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    valueVisible={areValuesVisible}
                  />
                ))}
            </section>
          </>
        )}
      </div>
    </section>
  );
}
