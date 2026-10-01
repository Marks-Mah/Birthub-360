import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils.js';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-obsidian text-white shadow-sm dark:bg-white dark:text-obsidian',
        secondary:
          'border-transparent bg-surface-elevated text-ink',
        destructive:
          'border-transparent bg-danger text-white shadow-sm',
        outline:
          'text-ink border-line',
        success:
          'border-transparent bg-success/15 text-success dark:text-success',
        warning:
          'border-transparent bg-warning/15 text-warning dark:text-warning',
        info:
          'border-transparent bg-info/15 text-info dark:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
