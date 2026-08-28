import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwiper } from "swiper/react";

interface AccountsSliderNavigationProps {
  isBeginning: boolean;
  isEnd: boolean;
}

export function SliderNavigation({
  isBeginning,
  isEnd,
}: AccountsSliderNavigationProps) {
  const swiper = useSwiper();

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="Anterior"
        className="flex items-center justify-center rounded-full py-3 pl-2.5 pr-3.5 transition-colors enabled:hover:bg-white/5 disabled:opacity-40"
        onClick={() => swiper.slidePrev()}
        disabled={isBeginning}
      >
        <ChevronLeft className="size-6 text-white" />
      </button>

      <button
        type="button"
        aria-label="Próximo"
        className="flex items-center justify-center rounded-full py-3 pl-2.5 pr-3.5 transition-colors enabled:hover:bg-white/5 disabled:opacity-40"
        onClick={() => swiper.slideNext()}
        disabled={isEnd}
      >
        <ChevronRight className="size-6 text-white" />
      </button>
    </div>
  );
}
