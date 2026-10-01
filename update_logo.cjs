const fs = require('fs');

const content = fs.readFileSync('src/components/brand/BirthHubLogo.tsx', 'utf-8');

const regex = /<g[\s\S]*?fill=\{`url\(#bh-gold-metal-\$\{uid\}\)`\}[\s\S]*?transform="translate\(284\.00 149\.75\) scale\(0\.02900 -0\.02900\)"\s*>([\s\S]*?)<\/g>/;
const match = content.match(regex);

if (!match) {
  console.log("Could not find the gold metal group.");
  process.exit(1);
}

const paths = match[1].match(/<path[\s\S]*?\/>/g);
console.log("Found " + paths.length + " paths.");

const b_path = `M450.4 707Q574.2 707 627.9 670.8Q681.6 634.6 681.6 573.4Q681.6 520.8 646.8 476.7Q612 432.6 547 404.5Q482 376.4 391 370.8Q511 369.4 573.8 326.1Q636.6 282.8 636.6 218.2Q636.6 165.8 612.2 125.1Q587.8 84.4 543.2 56.4Q498.6 28.4 436 14.2Q373.4 0 297 0Q267.8 0 227.6 1.5Q187.4 3 121 3Q94.8 3 63.8 2.5Q32.8 2 3.7 1.5Q-25.4 1 -45 0L-41 20Q-7 22 12 28Q31 34 42 52Q53 70 62 106L194 602Q201.8 632.8 202.4 651.3Q203 669.8 188.5 678.5Q174 687.2 135 688L140 708Q159.6 707 188.2 706.5Q216.8 706 247.7 705.5Q278.6 705 303 705Q353.2 705 385.7 706Q418.2 707 450.4 707ZM266 359 270 376H339.2Q393.8 376 430.6 407.9Q467.4 439.8 486.2 490.8Q505 541.8 505 596.8Q505 636.6 491.5 662.3Q478 688 438.6 688Q413 688 401 674.1Q389 660.2 378 617L243 106Q238.2 86.4 235.7 67.1Q233.2 47.8 242.2 35.4Q251.2 23 278.8 23Q331.6 23 368.9 53.4Q406.2 83.8 426.6 132.9Q447 182 447 237.2Q447 270.4 437.2 297.9Q427.4 325.4 404.3 342.2Q381.2 359 341.6 359Z`;

const birthHubPaths = paths.slice(0, 8).join('\\n          ');
const threeSixtyPaths = paths.slice(8, 12).join('\\n          ');

let newFileContent = `import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BRAND } from '../../config/brand.js';

export type BirthHubLogoVariant = 'core' | 'mark' | 'micro' | 'horizontal' | 'symbol' | 'icon';

interface BirthHubLogoProps {
  variant?: BirthHubLogoVariant;
  className?: string;
  title?: string;
  animated?: boolean;
}

export function BirthHubLogo({ variant = 'mark', className, title, animated = false }: BirthHubLogoProps) {
  const uid = useId().replace(/:/g, '');
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;

  const labelling = title
    ? { role: 'img' as const, 'aria-label': title }
    : { 'aria-hidden': true, focusable: false as const };

  const activeVariant = variant === 'symbol' ? 'core' : variant === 'icon' ? 'mark' : variant;

  const defs = (
    <defs>
      <linearGradient id={\`mark-arc-\${uid}\`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1677FF" />
        <stop offset="40%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
      <radialGradient id={\`mark-core-\${uid}\`} cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#1B2B64" />
        <stop offset="100%" stopColor="#0B132B" />
      </radialGradient>
      <radialGradient id={\`micro-core-\${uid}\`} cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#2A3B7D" />
        <stop offset="100%" stopColor="#0B132B" />
      </radialGradient>
    </defs>
  );

  if (activeVariant === 'micro') {
    return (
      <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" {...labelling}>
        {defs}
        <circle cx="128" cy="128" r="120" fill={\`url(#micro-core-\${uid})\`} />
        <path
          fill="#FAFAFA"
          transform="matrix(0.12 0 0 -0.12 90 170)"
          d="${b_path}"
        />
      </svg>
    );
  }

  if (activeVariant === 'mark') {
    return (
      <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" {...labelling}>
        {defs}
        <motion.circle
          cx="128" cy="128" r="118"
          fill="none"
          stroke={\`url(#mark-arc-\${uid})\`}
          strokeWidth="10"
          strokeDasharray="6 14"
          animate={shouldAnimate ? { rotate: 360 } : undefined}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '128px 128px' }}
        />
        <circle cx="128" cy="128" r="78" fill={\`url(#mark-core-\${uid})\`} />
        <circle cx="128" cy="128" r="64" fill="none" stroke="#D4AF37" strokeWidth="3" opacity="0.6" />
        <line x1="64" y1="128" x2="192" y2="128" stroke="#D4AF37" strokeWidth="2" opacity="0.35" />
        <path
          fill="#FAFAFA"
          transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
          d="${b_path}"
        />
      </svg>
    );
  }

  if (activeVariant === 'core') {
    return (
      <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" {...labelling}>
        {defs}
        <circle cx="128" cy="128" r="122" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 8" />
        <motion.circle
          cx="128" cy="128" r="102"
          fill="none"
          stroke={\`url(#mark-arc-\${uid})\`}
          strokeWidth="14"
          strokeDasharray="16 6"
          animate={shouldAnimate ? { rotate: -360 } : undefined}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '128px 128px' }}
        />
        <circle cx="128" cy="128" r="78" fill={\`url(#mark-core-\${uid})\`} />
        <circle cx="128" cy="128" r="64" fill="none" stroke="#D4AF37" strokeWidth="3" opacity="0.6" />
        <line x1="64" y1="128" x2="192" y2="128" stroke="#D4AF37" strokeWidth="2" opacity="0.35" />
        <path
          fill="#FAFAFA"
          transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
          d="${b_path}"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 946 256" className={className} xmlns="http://www.w3.org/2000/svg" {...labelling}>
      {defs}
      <g id={\`bh-emblem-\${uid}\`}>
        <motion.circle
          cx="128" cy="128" r="118"
          fill="none"
          stroke={\`url(#mark-arc-\${uid})\`}
          strokeWidth="10"
          strokeDasharray="6 14"
          animate={shouldAnimate ? { rotate: 360 } : undefined}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '128px 128px' }}
        />
        <circle cx="128" cy="128" r="78" fill={\`url(#mark-core-\${uid})\`} />
        <circle cx="128" cy="128" r="64" fill="none" stroke="#D4AF37" strokeWidth="3" opacity="0.6" />
        <line x1="64" y1="128" x2="192" y2="128" stroke="#D4AF37" strokeWidth="2" opacity="0.35" />
        <path
          fill="#FAFAFA"
          transform="matrix(0.0740 0 0 -0.0740 104.45 154.20)"
          d="${b_path}"
        />
      </g>
      
      <g transform="translate(284.00 149.75) scale(0.02900 -0.02900)">
        <g className="fill-[var(--ink)]">
          REPLACE_BIRTH_HUB
        </g>
        <g fill="#D4AF37">
          REPLACE_360
        </g>
      </g>
    </svg>
  );
}

export function BirthHubSignature({ className }: { className?: string }) {
  return (
    <span className={\`inline-flex items-center gap-2 \${className ?? ''}\`}>
      <BirthHubLogo variant="mark" className="h-full w-auto shrink-0" />
      <BirthHubWordmark className="text-[0.95em] leading-none whitespace-nowrap" />
    </span>
  );
}

export function BirthHubWordmark({ className }: { className?: string }) {
  return (
    <span className={\`font-display font-bold tracking-[0.18em] text-[var(--ink)] \${className ?? ''}\`}>
      {BRAND.name}
    </span>
  );
}
`;

newFileContent = newFileContent.replace('REPLACE_BIRTH_HUB', birthHubPaths);
newFileContent = newFileContent.replace('REPLACE_360', threeSixtyPaths);

fs.writeFileSync('src/components/brand/BirthHubLogo.tsx', newFileContent);
console.log("Updated BirthHubLogo.tsx successfully");
