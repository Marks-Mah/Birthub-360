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
          'bg-brand-active text-on-brand shadow-brand-sm hover:bg-brand hover:shadow-glow-brand hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95',
        primary:
          'bg-brand-active text-on-brand shadow-brand-sm hover:bg-brand hover:shadow-glow-brand hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95',
        tertiary:
          'bg-surface-subtle border-transparent text-ink hover:bg-surface-interactive hover:text-ink hover:scale-[1.02] active:scale-95',
        success:
          'bg-ok-solid text-white shadow-sm hover:opacity-90 hover:shadow-card hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95',
        // bg-btn-danger (color-mix com --danger, globals.css) — bg-red-500 cru com texto branco
        // media ~3.76:1, abaixo do mínimo AA 4.5:1 (mesma classe de achado do DQA-19 que motivou
        // bg-brand-active acima). btn-danger-hover escurece mais, mesma lógica de bg-brand-2.

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
        lg: 'h-10 px-8',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-10 w-10 p-0',

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
