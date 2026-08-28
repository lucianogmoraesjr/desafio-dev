import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorIcon } from "@/app/(private)/_components/icons/ColorIcon";

type Color = {
  color: string;
  bg: string;
};

const colors: Color[] = [
  { color: "#868E96", bg: "#F8F9FA" },
  { color: "#FA5252", bg: "#FFF5F5" },
  { color: "#E64980", bg: "#FFF0F6" },
  { color: "#BE4BDB", bg: "#F8F0FC" },
  { color: "#7950F2", bg: "#F3F0FF" },
  { color: "#4C6EF5", bg: "#EDF2FF" },
  { color: "#228BE6", bg: "#E7F5FF" },
  { color: "#15AABF", bg: "#E3FAFC" },
  { color: "#12B886", bg: "#E6FCF5" },
  { color: "#40C057", bg: "#EBFBEE" },
  { color: "#82C91E", bg: "#F4FCE3" },
  { color: "#FAB005", bg: "#FFF9DB" },
  { color: "#FD7E14", bg: "#FFF4E6" },
  { color: "#212529", bg: "#F8F9FA" },
];

interface ColorsDropdownProps {
  className?: string;
  error?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function ColorsDropdown({
  className,
  error,
  onChange,
  value,
}: ColorsDropdownProps) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(() => {
    if (!value) return null;
    return colors.find((c) => c.color === value) ?? null;
  });

  function handleSelectColor(color: Color) {
    setSelectedColor(color);
    onChange?.(color.color);
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:ring-red-500",
                className,
              )}
            >
              <div className="flex items-center gap-2">
                {!selectedColor && (
                  <span className="text-muted-foreground">
                    Selecione uma cor
                  </span>
                )}

                {selectedColor && (
                  <>
                    <ColorIcon
                      bg={selectedColor.bg}
                      color={selectedColor.color}
                      className="size-5"
                    />
                    <span className="text-gray-800">Cor selecionada</span>
                  </>
                )}
              </div>

              <ChevronDown className="size-4 opacity-50" />
            </button>
          }
        />

        <DropdownMenuContent className="grid grid-cols-4 w-[var(--radix-dropdown-menu-trigger-width)] gap-1 p-2">
          {colors.map(({ color, bg }) => (
            <DropdownMenuItem
              key={color}
              onClick={() => handleSelectColor({ color, bg })}
              className="flex justify-center cursor-pointer p-1"
            >
              <ColorIcon
                bg={bg}
                color={color}
                className="size-8 hover:scale-110 transition-transform"
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-red-500">
          <CircleX className="size-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
