import { cn } from "@/lib/utils.ts";
import { X } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const ClearButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer text-white",
        className,
      )}
    >
      <X className="h-5 w-5" />
    </button>
  );
};
