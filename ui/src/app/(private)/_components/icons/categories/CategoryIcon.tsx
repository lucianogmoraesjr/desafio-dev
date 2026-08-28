import { SVGAttributes } from "react";
import { iconsMap } from "./iconsMap";

interface CategoryIconProps {
  type: "income" | "expense";
  category?: string;
  className?: SVGAttributes<SVGSVGElement>["className"];
}

export function CategoryIcon({ type, category, className }: CategoryIconProps) {
  const Icon =
    iconsMap[type][
      (category as keyof (typeof iconsMap.expense | typeof iconsMap.income)) ??
        "default"
    ] ?? iconsMap[type].default;

  return <Icon className={className} />;
}
