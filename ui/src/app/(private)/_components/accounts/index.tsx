"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Loader2, PlusIcon } from "lucide-react";

import { cn, currencyFormatter } from "@/lib/utils";
import { EyeIcon } from "../icons/EyeIcon";
import { useAccountsController } from "./use-accounts-controller";
import { SliderNavigation } from "./slider-navigation";
import { AccountCard } from "./account-card";
import { NewAccountDialog } from "../dialogs/new-account-dialog";

export function Accounts() {
  const {
    handleSlideChange,
    toggleValuesVisibility,
    sliderState: { isBeginning, isEnd },
    windowWidth,
    areValuesVisible,
    isLoading,
    accounts,
    totalCurrentBalance,
    accountDialogOpen,
    setAccountDialogOpen,
  } = useAccountsController();

  return (
    <>
      <section className="w-full lg:w-1/2">
        <div className="flex h-full w-full flex-col rounded-2xl bg-primary px-4 py-8 lg:p-10">
          {isLoading && (
            <div className="flex h-full w-full  items-center justify-center">
              <Loader2 className="animate-spin size-10 fill-white text-gray-600" />
            </div>
          )}

          {!isLoading && (
            <>
              <div className="flex flex-col">
                <span className="tracking-[-0.5px] text-white">
                  Saldo total
                </span>

                <div className="flex items-center gap-2">
                  <strong
                    className={cn(
                      "text-2xl tracking-[-1px] text-white",
                      !areValuesVisible && "blur-md",
                    )}
                  >
                    {currencyFormatter.format(totalCurrentBalance / 100)}
                  </strong>

                  <button
                    aria-label="Mostrar/esconder saldo"
                    type="button"
                    className="flex h-8 w-8 items-center justify-center"
                    onClick={toggleValuesVisibility}
                  >
                    <EyeIcon open={!areValuesVisible} />
                  </button>
                </div>
              </div>

              <div className="mt-10 flex flex-1 flex-col justify-end lg:mt-0">
                {accounts.length === 0 && (
                  <div className="mb-4 flex flex-col gap-4">
                    <strong className="text-lg tracking-[-1px] text-white">
                      Minhas contas
                    </strong>

                    <button
                      type="button"
                      onClick={() => setAccountDialogOpen(true)}
                      className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-emerald-600 py-12 text-white"
                    >
                      <div className="rounded-full border-2 border-dashed border-white p-2">
                        <PlusIcon className="size-6" />
                      </div>

                      <span className="font-medium">
                        Cadastre uma nova conta
                      </span>
                    </button>
                  </div>
                )}

                {accounts.length > 0 && (
                  <div>
                    <Swiper
                      spaceBetween={16}
                      slidesPerView={windowWidth < 500 ? 1.2 : 2.1}
                      onSlideChange={handleSlideChange}
                    >
                      <div
                        className="mb-4 flex items-center justify-between"
                        slot="container-start"
                      >
                        <strong className="text-lg tracking-[-1px] text-white">
                          Minhas contas
                        </strong>

                        <SliderNavigation
                          isBeginning={isBeginning}
                          isEnd={isEnd}
                        />
                      </div>

                      {accounts.map((account) => (
                        <SwiperSlide key={account.id}>
                          <AccountCard account={account} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {accountDialogOpen && (
        <NewAccountDialog
          open={accountDialogOpen}
          onOpenChange={setAccountDialogOpen}
        />
      )}
    </>
  );
}
