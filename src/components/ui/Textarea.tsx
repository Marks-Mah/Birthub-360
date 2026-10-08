import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../lib/utils.js';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-xl border text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-white/5 disabled:opacity-60 disabled:hover:border-white/10',
  {
    variants: {
      variant: {
        default:
          'border-white/10 bg-[#1C1D24] px-4 py-3 hover:border-white/20 focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
        filled:
          'border-transparent bg-[#22232B] px-4 py-3 hover:bg-[#2A2B35] focus-visible:bg-[#1C1D24] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
        ghost:
          'border-transparent bg-transparent px-4 py-3 hover:bg-white/5 focus-visible:bg-white/5 focus-visible:border-[#8B7DFF]/50 focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/30',
        holographic:
          'border-[#8B7DFF]/40 bg-gradient-to-br from-[#1C1D24] to-[#8B7DFF]/10 px-4 py-3 hover:border-[#8B7DFF] focus-visible:border-[#8B7DFF] focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
