import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1E88FF] text-[#0B1B4D] hover:bg-[#1E88FF]/80",
        primary:
          "border-transparent bg-[#0B5FD9] text-white",
        navy:
          "border-transparent bg-[#0B1B4D] text-white",
        secondary:
          "border border-[#DCE7F7] bg-white text-[#0B1B4D]",
        destructive:
          "border-transparent bg-red-500 text-white",
        outline: "text-foreground border border-[#DCE7F7]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

