import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ShowPasswordButton } from "./ShowPasswordButton";
import { ClearButton } from "@/components/ClearButton.tsx";
import { cn } from "@/lib/utils.ts";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  className?: string;
}

export const Field: React.FC<Props> = ({
  className,
  name,
  type,
  label,
  placeholder,
  ...props
}) => {
  const form = useFormContext();
  const value = form.watch(name);
  const error = form.formState.errors[name]?.message as string;

  const [showPassword, setShowPassword] = React.useState(false);
  const onShowPassword = () => setShowPassword((prev) => !prev);

  const onClickClear = () => {
    form.setValue(name, "", { shouldValidate: true });
  };

  return (
    <div>
      {label && (
        <Label htmlFor={name} className="text-lg">
          {label}
        </Label>
      )}
      <div className="relative ">
        <Input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className={cn("h-9 text-md mt-2", className)}
          placeholder={placeholder}
          {...props}
          {...form.register(name)}
        />
        <div className="flex">
          {value && type === "password" && (
            <ShowPasswordButton onClick={onShowPassword} className="mr-2" />
          )}
          {value && <ClearButton onClick={onClickClear} />}
        </div>
      </div>
      {error && <div className="text-red-400 mt-1 text-sm">{error}</div>}
    </div>
  );
};
