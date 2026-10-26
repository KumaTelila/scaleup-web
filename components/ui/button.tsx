import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#0B5FD9] text-white hover:bg-[#094ebb] shadow-sm",
        navy: "bg-[#0B1B4D] text-white hover:bg-[#071336]",
        outline:
          "border-2 border-[#0B1B4D] bg-white text-[#0B1B4D] hover:bg-[#F3F8FF]",
        secondary:
          "bg-[#F3F8FF] text-[#0B1B4D] hover:bg-[#EAF3FF] border border-[#DCE7F7]",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-[#0B1B4D]",
        link: "text-[#0B5FD9] underline-offset-4 hover:underline p-0 h-auto font-medium",
        accent: "bg-[#1E88FF] text-white hover:bg-[#0b75ec]",
      },
      size: {
        default: "px-7 py-3.5 text-base",
        sm: "px-5 py-2 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
