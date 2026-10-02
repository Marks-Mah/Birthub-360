import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils.js';

const selectVariants = cva(
  'flex w-full rounded-control border bg-surface-elevated/70 backdrop-blur-sm text-sm text-ink transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60 disabled:hover:border-line disabled:hover:scale-100 disabled:focus-visible:scale-100',
  {
    variants: {
      variant: {
        default:
          'border-brand/20 hover:border-brand hover:shadow-glow-brand hover:bg-surface-elevated hover:scale-[1.005] focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:scale-[1.01] focus-visible:shadow-glow-brand-strong',
        filled:
          'border-transparent bg-surface-2 hover:bg-surface-interactive hover:border-brand/30 hover:shadow-glow-brand hover:scale-[1.005] focus-visible:bg-surface focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:shadow-glow-brand-strong focus-visible:scale-[1.01]',
        ghost:
          'border-transparent bg-transparent hover:bg-surface-subtle hover:border-brand/20 hover:shadow-glow-brand hover:scale-[1.005] focus-visible:bg-surface-subtle focus-visible:border-brand/40 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:shadow-glow-brand-strong focus-visible:scale-[1.01]',
        cosmic:
          'border-brand/40 bg-gradient-to-br from-surface-elevated/80 to-brand/5 shadow-glow-brand hover:border-brand/70 hover:shadow-glow-brand-strong focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:scale-[1.01] focus-visible:shadow-glow-brand-strong',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2.5 py-1 text-xs',
        md: 'h-9 px-3 py-1.5',
        lg: 'h-11 px-4 py-2.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <select className={cn(selectVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Select.displayName = 'Select';

export { Select, selectVariants };
