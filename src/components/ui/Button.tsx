import * as React from 'react';
/* eslint-disable react-refresh/only-export-components */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:bg-surface-subtle disabled:text-ink-2 disabled:border-transparent',
  {
    variants: {
      variant: {
        default:
          'bg-gold text-obsidian shadow-sm hover:bg-gold/90 hover:shadow-md active:bg-gold/80',
        primary:
          'bg-obsidian text-white shadow-sm hover:bg-obsidian/90 hover:shadow-md active:bg-obsidian/80 dark:bg-white dark:text-obsidian dark:hover:bg-white/90',
        destructive:
          'bg-danger text-white shadow-sm hover:bg-danger/90 active:bg-danger/80',
        outline:
          'border border-line bg-transparent text-ink hover:border-ink-2/30 hover:bg-surface-interactive active:bg-surface-subtle',
        secondary:
          'border border-transparent bg-surface-elevated text-ink shadow-sm hover:bg-surface-interactive active:bg-surface-subtle',
        ghost:
          'border border-transparent text-ink-2 hover:bg-surface-interactive hover:text-ink active:bg-surface-subtle',
        link: 'text-brand-ink dark:text-brand underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
