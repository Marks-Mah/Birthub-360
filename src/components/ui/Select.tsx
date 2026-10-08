import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils.js';

const selectVariants = cva(
  'flex w-full rounded-xl border bg-[#1C1D24] text-sm text-slate-200 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-white/5 disabled:opacity-60 disabled:hover:border-white/10 disabled:hover:scale-100 disabled:focus-visible:scale-100',
  {
    variants: {
      variant: {
        default:
          'border-white/10 hover:border-white/20 hover:bg-[#22232B] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
        filled:
          'border-transparent bg-[#22232B] hover:bg-[#2A2B35] focus-visible:bg-[#1C1D24] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
        ghost:
          'border-transparent bg-transparent hover:bg-white/5 focus-visible:bg-white/5 focus-visible:border-[#8B7DFF]/50 focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/30',
        cosmic:
          'border-[#8B7DFF]/40 bg-gradient-to-br from-[#1C1D24] to-[#8B7DFF]/10 hover:border-[#8B7DFF] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
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
