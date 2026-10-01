import * as React from 'react';

import { cn } from '../../lib/utils.js';

const inputVariants = cva(
  'flex w-full rounded-control border border-line bg-surface-elevated/70 backdrop-blur-sm text-ink placeholder:text-ink-2/75 transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand/40 hover:bg-surface-elevated hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25 focus-visible:shadow-[inset_0_2px_8px_rgba(212,175,55,0.06)] disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60 disabled:hover:border-line',
  {
    variants: {
      inputSize: {
        default: 'h-10 px-3 py-2 text-sm',
        sm: 'h-8 px-2.5 py-1 text-xs',
        md: 'h-9 px-3 py-1.5 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
      },
      variant: {
        default: '',
        filled:
          'bg-surface-2 border-transparent hover:bg-surface-interactive focus-visible:bg-surface focus-visible:border-brand',
        ghost:
          'bg-transparent border-transparent hover:bg-surface-subtle focus-visible:bg-surface-subtle focus-visible:border-brand/30',
        cosmic:
          'bg-surface-elevated/80 border-brand/30 shadow-[0_0_15px_rgba(212,175,55,0.08)] hover:border-brand/60 focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/25 focus-visible:shadow-[0_0_20px_rgba(212,175,55,0.18)]',
      },
    },
    defaultVariants: {
      inputSize: 'default',
      variant: 'default',
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border bg-surface-subtle px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-danger focus-visible:ring-danger' : 'border-line',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
