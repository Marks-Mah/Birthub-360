import { motion, useReducedMotion } from 'framer-motion';
import type React from 'react';
import { SoundFX, type UiSound } from '../../../lib/soundEffects.js';
import { cn } from '../../../lib/utils.js';

export interface AnimatedIconProps {
  /** Componente de ícone (Lucide, SVG ou elemento JSX) */
  icon?: React.ComponentType<{ className?: string; size?: number | string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  children?: React.ReactNode;
  /** Tipo de animação 2026 */
  animation?: 'float' | 'pulse' | 'spin' | 'bounce' | 'glow' | 'orbit' | 'none';
  /** Cor do halo luminoso */
  glowColor?: 'brand' | 'iris' | 'cyan' | 'emerald' | 'amber';
  /** Tamanho pré-definido ou estilo livre */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Envolve o ícone em uma cápsula de vidro especular com borda reflexiva (Bento badge) */
  badge?: boolean;
  /** Som ao passar o cursor ou clicar */
  sound?: UiSound;
  /** Reação interativa ao toque/hover */
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AnimatedIcon({
  icon: IconComponent,
  children,
  animation = 'none',
  glowColor = 'brand',
  size = 'md',
  badge = false,
  sound,
  interactive = false,
  className,
  onClick,
}: AnimatedIconProps) {
  const reduceMotion = useReducedMotion();

  const glowStyles = {
    brand: 'shadow-[0_0_16px_rgba(212,175,55,0.4)] text-brand',
    iris: 'shadow-[0_0_16px_rgba(197,54,120,0.4)] text-iris',
    cyan: 'shadow-[0_0_16px_rgba(22,119,255,0.4)] text-accent-cyan',
    emerald: 'shadow-[0_0_16px_rgba(15,157,100,0.4)] text-success',
    amber: 'shadow-[0_0_16px_rgba(255,197,0,0.4)] text-warning',
  };

  const badgeGradients = {
    brand: 'bg-brand/10 border-brand/35 text-brand',
    iris: 'bg-iris/10 border-iris/35 text-iris',
    cyan: 'bg-accent-cyan/10 border-accent-cyan/35 text-accent-cyan',
    emerald: 'bg-success/10 border-success/35 text-success',
    amber: 'bg-warning/10 border-warning/35 text-warning',
  };

  const sizePixels = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  };

  const badgeSizes = {
    xs: 'p-1.5 rounded-lg',
    sm: 'p-2 rounded-xl',
    md: 'p-2.5 rounded-2xl',
    lg: 'p-3.5 rounded-2xl',
    xl: 'p-5 rounded-3xl',
  };

  const getAnimationVariants = () => {
    if (reduceMotion || animation === 'none') {
      return {};
    }

    switch (animation) {
      case 'float':
        return {
          animate: {
            y: [-3, 3, -3],
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      case 'pulse':
        return {
          animate: {
            scale: [1, 1.08, 1],
            opacity: [0.85, 1, 0.85],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      case 'spin':
        return {
          animate: {
            rotate: 360,
            transition: { duration: 8, repeat: Infinity, ease: 'linear' },
          },
        };
      case 'bounce':
        return {
          animate: {
            y: [0, -6, 0],
            transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      case 'glow':
        return {
          animate: {
            opacity: [0.7, 1, 0.7],
            filter: [
              'drop-shadow(0 0 2px currentColor)',
              'drop-shadow(0 0 8px currentColor)',
              'drop-shadow(0 0 2px currentColor)',
            ],
            transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      case 'orbit':
        return {
          animate: {
            rotateZ: [0, 10, -10, 0],
            transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      default:
        return {};
    }
  };

  const handleClick = () => {
    if (sound) {
      SoundFX.play(sound);
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (interactive && sound) {
      SoundFX.play('hover');
    }
  };

  const iconContent = (
    <motion.span
      className={cn('inline-flex items-center justify-center', className)}
      {...getAnimationVariants()}
      whileHover={interactive && !reduceMotion ? { scale: 1.12, rotate: 4 } : undefined}
      whileTap={interactive && !reduceMotion ? { scale: 0.92 } : undefined}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {IconComponent ? (
        <IconComponent size={sizePixels[size]} aria-hidden="true" className="shrink-0" />
      ) : (
        children
      )}
    </motion.span>
  );

  if (badge) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center border backdrop-blur-md shadow-sm transition-all duration-300',
          badgeSizes[size],
          badgeGradients[glowColor],
          interactive && 'cursor-pointer hover:shadow-card hover:-translate-y-0.5 active:scale-95',
        )}
      >
        {iconContent}
      </div>
    );
  }

  return iconContent;
}
