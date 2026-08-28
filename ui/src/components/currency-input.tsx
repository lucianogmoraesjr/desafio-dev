import { CircleX } from "lucide-react";
import { NumericFormat } from "react-number-format";

interface CurrencyInputProps {
  error?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export function CurrencyInput({ error, value, onChange }: CurrencyInputProps) {
  return (
    <div>
      <NumericFormat
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full text-[2rem] font-bold text-gray-800 outline-none"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
      />

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-900">
          <CircleX className="size-4" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
