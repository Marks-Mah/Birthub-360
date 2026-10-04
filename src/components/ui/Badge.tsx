import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-brand to-brand-2 text-on-brand shadow-glow-brand',
        secondary: 'border-brand/20 bg-surface-elevated text-ink shadow-glow-brand',
        destructive:
          'border-transparent bg-gradient-to-r from-danger to-pulse text-white shadow-glow-pulse',
        danger:
          'border-transparent bg-gradient-to-r from-danger to-pulse text-white shadow-glow-pulse',
        outline: 'text-ink border-brand/50 shadow-glow-brand',
        success:
          'border-transparent bg-gradient-to-r from-ok/20 to-ok/20 text-ok shadow-glow-ok',
        warning:
          'border-transparent bg-warning/20 text-warning shadow-[0_0_15px_rgba(245,158,11,0.4)]',
        info: 'border-transparent bg-info/20 text-info shadow-[0_0_15px_rgba(59,130,246,0.4)]',
        holographic: 'border-brand/40 bg-brand/20 text-brand shadow-glow-brand-strong',
        neon: 'border-brand/50 bg-brand/20 text-brand shadow-glow-brand-strong font-mono',
        gradient:
          'border-transparent bg-gradient-to-r from-brand to-brand-2 text-on-brand shadow-glow-brand-strong',
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
