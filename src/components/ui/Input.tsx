import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils.js';

const inputVariants = cva(
  'flex w-full rounded-xl border border-white/10 bg-[#1C1D24] text-slate-200 placeholder:text-slate-500 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/20 focus-visible:outline-none focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50 disabled:cursor-not-allowed disabled:bg-white/5 disabled:opacity-60 disabled:hover:border-white/10',
  {
    variants: {
      inputSize: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 py-1 text-xs',
        md: 'h-9 px-3 py-1.5 text-sm',
        lg: 'h-11 px-4 py-2.5 text-base',
      },
      variant: {
        default: '',
        filled:
          'bg-[#22232B] border-transparent hover:bg-[#2A2B35] focus-visible:bg-[#1C1D24] focus-visible:border-[#8B7DFF]',
        ghost:
          'bg-transparent border-transparent hover:bg-white/5 focus-visible:bg-white/5 focus-visible:border-[#8B7DFF]/50',
        cosmic:
          'bg-gradient-to-br from-[#1C1D24] to-[#8B7DFF]/10 border-[#8B7DFF]/40 hover:border-[#8B7DFF] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/40',
        vancouver:
          'bg-[#1C1D24] border-white/10 hover:border-[#8B7DFF]/30 focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/30',
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
