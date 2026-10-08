import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B7DFF] focus:ring-offset-2 focus:ring-offset-[#13151A]',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#8B7DFF]/10 text-[#8B7DFF]',
        secondary: 'border-white/10 bg-[#1C1D24] text-slate-300',
        destructive: 'border-transparent bg-[#EF4444]/10 text-[#EF4444]',
        danger: 'border-transparent bg-[#EF4444]/10 text-[#EF4444]',
        outline: 'text-slate-300 border-white/10',
        success: 'border-transparent bg-[#22c55e]/10 text-[#22c55e]',
        warning: 'border-transparent bg-[#EAB308]/10 text-[#EAB308]',
        info: 'border-transparent bg-[#38bdf8]/10 text-[#38bdf8]',
        holographic: 'border-[#8B7DFF]/20 bg-[#8B7DFF]/10 text-[#8B7DFF]',
        neon: 'border-[#8B7DFF]/20 bg-[#8B7DFF]/10 text-[#8B7DFF] font-mono',
        gradient:
          'border-transparent bg-gradient-to-r from-[#8B7DFF] to-[#6D5CE6] text-white shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
