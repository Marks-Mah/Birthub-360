import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SoundFX } from '../../lib/soundEffects.js';
import { type ToastMessage, toast } from '../../lib/toast.js';

// WCAG 2 AA compliant contrast
const KIND_STYLES: Record<
  ToastMessage['kind'],
  { bg: string; icon: typeof CheckCircle2; specular: string }
> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-xl',
    icon: CheckCircle2,
    specular: 'from-emerald-500/60',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/90 border border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-100 shadow-xl',
    icon: AlertTriangle,
    specular: 'from-rose-500/60',
  },
  info: {
    bg: 'bg-surface border border-line text-ink shadow-xl',
    icon: Info,
    specular: 'from-brand/60',
  },
};

const AUTO_DISMISS_MS = 4500;

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((message) => {
      if (message.kind === 'success') {
        SoundFX.play('success');
      } else if (message.kind === 'error') {
        SoundFX.play('error');
      } else {
        SoundFX.play('focus');
      }

      setToasts((prev) => [...prev, message]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== message.id));
      }, AUTO_DISMISS_MS);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const { bg, icon: Icon } = KIND_STYLES[t.kind];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(_e, { offset, velocity }) => {
                if (offset.x > 100 || velocity.x > 500) {
                  setToasts((prev) => prev.filter((x) => x.id !== t.id));
                }
              }}
              role={t.kind === 'error' ? 'alert' : 'status'}
              aria-live={t.kind === 'error' ? 'assertive' : 'polite'}
              className={`${bg} relative overflow-hidden pointer-events-auto px-4 py-3.5 rounded-2xl flex items-start gap-3 text-sm font-semibold`}
            >
              {/* Linha de reflexo especular 2026 */}
              <div
                className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none`}
              />

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/10 shadow-xs mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 leading-snug">{t.text}</span>
              <button
                type="button"
                onClick={() => {
                  SoundFX.play('click');
                  setToasts((prev) => prev.filter((x) => x.id !== t.id));
                }}
                aria-label="Fechar notificação"
                className="shrink-0 opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
