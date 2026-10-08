import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils.js';

export interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  isOpen?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  variant?: string;
  maxWidth?: string;
  preventClose?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      aria-modal="true"
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#1C1D24] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl text-slate-200',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Fechar modal"
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-[#13151A] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#8B7DFF] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white/5 data-[state=open]:text-slate-400 text-slate-400"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Fechar modal</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-display font-semibold leading-none tracking-tight text-white', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-slate-400', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogTrigger = DialogPrimitive.Trigger;

function Dialog({
  open,
  isOpen,
  onClose,
  onOpenChange,
  title,
  maxWidth,
  preventClose,
  footer,
  children,
  ...props
}: DialogProps) {
  const isConvenienceMode =
    isOpen !== undefined || onClose !== undefined || title !== undefined || footer !== undefined;
  if (!isConvenienceMode) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </DialogPrimitive.Root>
    );
  }

  const effectiveOpen = open ?? isOpen ?? false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen && onClose) onClose();
  };

  return (
    <DialogPrimitive.Root open={effectiveOpen} onOpenChange={handleOpenChange} {...props}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-modal="true"
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#1C1D24] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl text-slate-200',
            maxWidth || 'max-w-lg',
          )}
        >
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          )}
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
          {!preventClose && (
            <DialogPrimitive.Close
              aria-label="Fechar modal"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-bg transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar modal</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
