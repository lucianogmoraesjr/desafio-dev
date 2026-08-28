import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

interface TransactionsSliderNavigationProps {
  isBeginning: boolean;
  isEnd: boolean;
}

export function SliderNavigation({
  isBeginning,
  isEnd,
}: TransactionsSliderNavigationProps) {
  const swiper = useSwiper();

  return (
    <>
      <button
        type="button"
        aria-label="Anterior"
        className="absolute left-0 top-0 z-10 flex items-center justify-center bg-gradient-to-r from-gray-100 to-transparent py-3 pl-2.5 pr-3.5 transition-colors disabled:opacity-40"
        onClick={() => swiper.slidePrev()}
        disabled={isBeginning}
      >
        <ChevronLeft className="size-6 text-gray-800" />
      </button>

      <button
        type="button"
        aria-label="Próximo"
        className="absolute right-0 top-0 z-10 flex items-center justify-center bg-gradient-to-l from-gray-100 to-transparent py-3 pl-2.5 pr-3.5 transition-colors disabled:opacity-40"
        onClick={() => swiper.slideNext()}
        disabled={isEnd}
      >
        <ChevronRight className="size-6 text-gray-800" />
      </button>
    </>
  );
}
