import { cn } from "@/lib/utils";
import { useSwiper } from "swiper/react";

interface SliderOptionProps {
  isActive: boolean;
  month: string;
  index: number;
}

export function SliderOption({ isActive, month, index }: SliderOptionProps) {
  const swiper = useSwiper();

  return (
    <button
      type="button"
      onClick={() => swiper.slideTo(index)}
      className={cn(
        "h-12 w-full rounded-full text-sm font-medium text-gray-800",
        isActive && "bg-white",
      )}
    >
      {month}
    </button>
  );
}
