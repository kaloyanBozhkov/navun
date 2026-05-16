"use client";

import { forwardRef } from "react";
import { DotsLoader } from "@koko420/react-components";
import {
  Button as ShadcnButton,
  type buttonVariants,
} from "@/app/_components/shadcn/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, disabled, children, className, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        disabled={isLoading || disabled}
        className={cn("relative", className)}
        {...props}
      >
        {isLoading ? <DotsLoader size="sm" /> : children}
      </ShadcnButton>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
