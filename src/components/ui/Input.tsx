import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils.js';

const inputVariants = cva(
  'flex w-full rounded-control border border-brand/20 bg-surface-elevated/70 backdrop-blur-sm text-ink placeholder:text-ink-2/75 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand hover:shadow-glow-brand hover:bg-surface-elevated focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:shadow-glow-brand-strong disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60 disabled:hover:border-line disabled:hover:shadow-none',
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
          'bg-surface-2 border-transparent hover:bg-surface-interactive hover:shadow-glow-brand focus-visible:bg-surface focus-visible:border-brand focus-visible:shadow-glow-brand-strong',
        ghost:
          'bg-transparent border-transparent hover:bg-surface-subtle hover:shadow-glow-brand focus-visible:bg-surface-subtle focus-visible:border-brand/50 focus-visible:shadow-glow-brand-strong',
        cosmic:
          'bg-gradient-to-br from-surface-elevated/80 to-brand/5 border-brand/40 shadow-glow-brand hover:border-brand hover:shadow-glow-brand-strong focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:shadow-glow-brand-strong',
        vancouver:
          'bg-gradient-to-br from-surface-elevated/80 to-surface/70 border-line hover:border-brand/30 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:shadow-glow-brand',
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
  VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, inputSize }),
          error &&
          'border-danger focus-visible:ring-danger focus-visible:shadow-[0_0_15px_rgba(239,68,68,0.4)]',
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
