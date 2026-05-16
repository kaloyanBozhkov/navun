"use client";

import { forwardRef } from "react";
import { Input as ShadcnInput } from "@/app/_components/shadcn/input";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<typeof ShadcnInput> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <ShadcnInput
          ref={ref}
          id={id}
          className={cn(error && "border-destructive", className)}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, type InputProps };
