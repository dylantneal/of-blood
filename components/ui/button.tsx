import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-display",
  {
    variants: {
      variant: {
        primary: "bg-primary text-fg hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(179,10,10,0.6)] hover:scale-105 active:scale-100 border border-primary/50",
        ghost: "border-2 border-fg/50 text-fg hover:border-fg hover:bg-fg hover:text-background hover:scale-105 active:scale-100 backdrop-blur-sm",
        gold: "bg-gold text-background hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(201,162,39,0.5)] hover:scale-105 active:scale-100 border border-gold/50",
        link: "text-fg underline-offset-4 hover:underline hover:text-primary",
      },
      size: {
        default: "h-12 px-8 py-3 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-12 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'variant'> {
  variant?: 'primary' | 'ghost' | 'gold' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      // When asChild is true, clone the child and merge props
      // asChild, variant, and size are already destructured, so they won't be passed to child
      return React.cloneElement(children, {
        className: cn(buttonClasses, children.props.className),
        ...props,
      } as any);
    }

    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

