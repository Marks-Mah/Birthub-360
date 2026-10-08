import * as React from 'react';
/* eslint-disable react-refresh/only-export-components */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils.js';
import { Magnetic } from './Magnetic.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7DFF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#13151A] disabled:pointer-events-none disabled:bg-white/5 disabled:text-slate-500 disabled:border-transparent',
  {
    variants: {
      variant: {
        default:
          'bg-[#8B7DFF] text-[#13151A] hover:bg-[#9b8fff] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm',
        primary:
          'bg-[#8B7DFF] text-[#13151A] hover:bg-[#9b8fff] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm',
        tertiary:
          'bg-[#1C1D24] border-transparent text-slate-200 hover:bg-[#22232B] hover:text-white hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]',
        success:
          'bg-[#22c55e] text-[#13151A] font-bold shadow-sm hover:bg-[#4ade80] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]',
        destructive:
          'bg-[#EF4444] text-white font-bold shadow-sm hover:bg-[#f87171] hover:-translate-y-0.5 active:bg-[#dc2626]',
        outline:
          'border border-white/10 bg-transparent text-slate-200 hover:border-white/20 hover:bg-white/5 active:bg-white/10',
        secondary:
          'border border-white/5 bg-[#1C1D24] text-slate-200 shadow-sm hover:bg-[#22232B] hover:border-white/10 active:bg-[#15151A]',
        ghost:
          'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white active:bg-white/10',
        link: 'text-[#8B7DFF] underline-offset-4 hover:underline hover:text-[#9b8fff]',
        cosmic:
          'bg-[#8B7DFF] text-[#13151A] hover:bg-[#9b8fff] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm',
        vancouver:
          'bg-[#8B7DFF] text-[#13151A] hover:bg-[#9b8fff] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm',
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
  soundClick?: boolean;
  soundHover?: boolean;
  sound?: string;
  shine?: boolean;
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      soundClick = false,
      soundHover = false,
      sound,
      shine = false,
      magnetic = variant === 'default' ||
        variant === 'primary' ||
        variant === 'cosmic' ||
        variant === 'vancouver',
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const buttonContent = (
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

    if (magnetic) {
      return <Magnetic>{buttonContent}</Magnetic>;
    }

    return buttonContent;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
