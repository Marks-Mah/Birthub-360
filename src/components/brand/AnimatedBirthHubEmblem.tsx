import { motion } from 'framer-motion';
import { useId } from 'react';
import { useReducedMotion } from '../../lib/motion.js';

interface AnimatedBirthHubEmblemProps {
  /** Diameter size in pixels (default: 210) */
  size?: number;
  className?: string;
  /** Whether to show the interactive Call to Action badge below the emblem */
  showCta?: boolean;
  /** Custom CTA text */
  ctaText?: string;
  /** Click handler for the interactive emblem & CTA */
  onAction?: () => void;
}

/**
 * AnimatedBirthHubEmblem — Emblema oficial Birth Hub 360 com animação orbital independente
 * e chamada para ação interativa.
 *
 * Arquitetura de movimento:
 * 1. Coroa solar de raios (sunburst): gira suavemente no sentido horário (60s).
 * 2. Anel cromático de 6 gradientes: rotação suave no sentido anti-horário (85s).
 * 3. Núcleo central com 'B' serifado majestoso: MANTÉM-SE SEMPRE NA VERTICAL (não tomba de cabeça para baixo).
 * 4. Aura de pulso luminoso dourado e gradiente de profundidade.
 * 5. Chamada para ação (CTA) integrada com radar ping e microinteração tátil.
 */
export function AnimatedBirthHubEmblem({
  size = 210,
  className = '',
  showCta = true,
  ctaText = 'Acessar Command Center →',
  onAction,
}: AnimatedBirthHubEmblemProps) {
  const uid = useId().replace(/:/g, '');
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Interactive Trigger Wrapper */}
      <button
        type="button"
        onClick={onAction}
        className="group relative flex flex-col items-center cursor-pointer border-0 bg-transparent p-0 focus:outline-none"
        aria-label="Acessar Birth Hub 360"
        title="Acessar a Central de Inteligência Comercial Birth Hub 360"
      >
        {/* Luminous Ambient Pulse Aura */}
        <div
          className="pointer-events-none absolute -inset-5 rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#FF4FA3]/15 to-[#1677FF]/20 blur-2xl opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 animate-pulse"
          aria-hidden="true"
        />

        {/* Concentric Elevation Plate */}
        <div
          className="relative flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
          style={{ width: size, height: size }}
        >
          <svg
            viewBox="0 0 256 256"
            width={size}
            height={size}
            className="w-full h-full drop-shadow-[0_12px_36px_rgba(11,19,43,0.18)]"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Emblema Birth Hub 360"
          >
            <defs>
              <linearGradient
                id={`bh-ani-o0-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="127.14"
                y1="46.00"
                x2="199.44"
                y2="87.75"
              >
                <stop offset="0" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#FF3158" />
              </linearGradient>
              <linearGradient
                id={`bh-ani-o1-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="198.58"
                y1="86.26"
                x2="198.58"
                y2="169.74"
              >
                <stop offset="0" stopColor="#FF3158" />
                <stop offset="1" stopColor="#FF4FA3" />
              </linearGradient>
              <linearGradient
                id={`bh-ani-o2-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="199.44"
                y1="168.25"
                x2="127.14"
                y2="210.00"
              >
                <stop offset="0" stopColor="#FF4FA3" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient
                id={`bh-ani-o3-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="128.86"
                y1="210.00"
                x2="56.56"
                y2="168.25"
              >
                <stop offset="0" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#1677FF" />
              </linearGradient>
              <linearGradient
                id={`bh-ani-o4-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="57.42"
                y1="169.74"
                x2="57.42"
                y2="86.26"
              >
                <stop offset="0" stopColor="#1677FF" />
                <stop offset="1" stopColor="#9C5A7E" />
              </linearGradient>
              <linearGradient
                id={`bh-ani-o5-${uid}`}
                gradientUnits="userSpaceOnUse"
                x1="56.56"
                y1="87.75"
                x2="128.86"
                y2="46.00"
              >
                <stop offset="0" stopColor="#9C5A7E" />
                <stop offset="1" stopColor="#D4AF37" />
              </linearGradient>
              <linearGradient id={`bh-ani-bar-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#D4AF37" />
                <stop offset="0.45" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="0.55" stopColor="#D4AF37" stopOpacity="0.2" />
                <stop offset="1" stopColor="#D4AF37" />
              </linearGradient>
              <radialGradient id={`bh-ani-sheen-${uid}`} cx="0.3" cy="0.25" r="0.55">
                <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.36" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <linearGradient id={`bh-ani-core-shade-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
                <stop offset="0.42" stopColor="#000000" stopOpacity="0" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* ── Layer 1: Sunburst Rays (Coroa Solar Radiante) ────────── */}
            <motion.g
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '128px 128px' }}
            >
              <circle
                cx="128.0"
                cy="128.0"
                r="118.12"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="11.77"
                opacity="0.72"
                strokeDasharray="1.44 10.93"
              />
            </motion.g>

            {/* ── Layer 2: Chromatic Orbit Ring (Arco de 6 Cores) ──────── */}
            <motion.g
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '128px 128px' }}
              fill="none"
              strokeWidth="16.0"
            >
              <path stroke={`url(#bh-ani-o0-${uid})`} d="M127.14 46.00 A82.0 82.0 0 0 1 199.44 87.75" />
              <path stroke={`url(#bh-ani-o1-${uid})`} d="M198.58 86.26 A82.0 82.0 0 0 1 198.58 169.74" />
              <path stroke={`url(#bh-ani-o2-${uid})`} d="M199.44 168.25 A82.0 82.0 0 0 1 127.14 210.00" />
              <path stroke={`url(#bh-ani-o3-${uid})`} d="M128.86 210.00 A82.0 82.0 0 0 1 56.56 168.25" />
              <path stroke={`url(#bh-ani-o4-${uid})`} d="M57.42 169.74 A82.0 82.0 0 0 1 57.42 86.26" />
              <path stroke={`url(#bh-ani-o5-${uid})`} d="M56.56 87.75 A82.0 82.0 0 0 1 128.86 46.00" />
            </motion.g>

            {/* ── Layer 3: Central Nucleus + Majestic 'B' (STAYS UPRIGHT) ─ */}
            <g id={`bh-ani-core-${uid}`}>
              {/* Outer sheen ring */}
              <circle cx="128.0" cy="128.0" r="90" fill={`url(#bh-ani-sheen-${uid})`} />

              {/* Solid Midnight Navy Core */}
              <circle cx="128.0" cy="128.0" r="74.0" fill="#0B132B" />
              <circle cx="128.0" cy="128.0" r="74.0" fill={`url(#bh-ani-core-shade-${uid})`} />

              {/* Antique Gold Inner Ring */}
              <circle
                cx="128.0"
                cy="128.0"
                r="61.5"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="5.0"
              />

              {/* Delicate Gold Horizontal Equator Bar */}
              <rect
                x="64.0"
                y="126.5"
                width="128.0"
                height="3.0"
                fill={`url(#bh-ani-bar-${uid})`}
              />

              {/* The Official Serif Italic 'B' — Perfectly Centered and Upright */}
              <path
                fill="#FFF4F9"
                transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
                d="M450.4 707Q574.2 707 627.9 670.8Q681.6 634.6 681.6 573.4Q681.6 520.8 646.8 476.7Q612 432.6 547 404.5Q482 376.4 391 370.8Q511 369.4 573.8 326.1Q636.6 282.8 636.6 218.2Q636.6 165.8 612.2 125.1Q587.8 84.4 543.2 56.4Q498.6 28.4 436 14.2Q373.4 0 297 0Q267.8 0 227.6 1.5Q187.4 3 121 3Q94.8 3 63.8 2.5Q32.8 2 3.7 1.5Q-25.4 1 -45 0L-41 20Q-7 22 12 28Q31 34 42 52Q53 70 62 106L194 602Q201.8 632.8 202.4 651.3Q203 669.8 188.5 678.5Q174 687.2 135 688L140 708Q159.6 707 188.2 706.5Q216.8 706 247.7 705.5Q278.6 705 303 705Q353.2 705 385.7 706Q418.2 707 450.4 707ZM266 359 270 376H339.2Q393.8 376 430.6 407.9Q467.4 439.8 486.2 490.8Q505 541.8 505 596.8Q505 636.6 491.5 662.3Q478 688 438.6 688Q413 688 401 674.1Q389 660.2 378 617L243 106Q238.2 86.4 235.7 67.1Q233.2 47.8 242.2 35.4Q251.2 23 278.8 23Q331.6 23 368.9 53.4Q406.2 83.8 426.6 132.9Q447 182 447 237.2Q447 270.4 437.2 297.9Q427.4 325.4 404.3 342.2Q381.2 359 341.6 359Z"
              />
            </g>
          </svg>
        </div>

        {/* ── Interactive Call to Action (Chamada para Ação) ─────────── */}
        {showCta && (
          <div className="mt-4 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0B132B] text-white text-xs font-bold font-mono tracking-wide shadow-[0_8px_24px_rgba(11,19,43,0.35)] border border-[#D4AF37]/50 group-hover:border-[#D4AF37] group-hover:bg-[#121B38] group-hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)] group-hover:scale-105 transition-all duration-300">
            {/* Live Radar Ping Beacon */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
            </span>
            <span className="text-white group-hover:text-[#F7E9B8] transition-colors">{ctaText}</span>
          </div>
        )}
      </button>
    </div>
  );
}
