import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface Props {
  setGroupBy: (groupBy: string) => void;
  className?: string;
}

export const GroupBySelect: React.FC<Props> = ({ setGroupBy, className }) => {
  return (
    <Select onValueChange={setGroupBy}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Группировать по: " />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все</SelectItem>
        <SelectItem value="today">Сегодня</SelectItem>
        <SelectItem value="week">На неделю</SelectItem>
        <SelectItem value="future">На будущее</SelectItem>
      </SelectContent>
    </Select>
  );
};
