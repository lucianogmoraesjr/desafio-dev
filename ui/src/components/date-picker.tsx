"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id="date-picker-simple"
            className="justify-start font-normal"
          >
            {value ? (
              format(value, "PPP", { locale: ptBR })
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={ptBR}
          mode="single"
          selected={value}
          onSelect={(value) => onChange?.(value)}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  );
}
