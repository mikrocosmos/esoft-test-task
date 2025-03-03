import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import React from "react";

interface Props {
  className?: string;
  onClick?: VoidFunction;
}

export const ShowPasswordButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "absolute right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer text-white",
        className,
      )}
    >
      <Eye className="h-5 w-5" />
    </button>
  );
};
