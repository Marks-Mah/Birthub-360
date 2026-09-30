import type React from 'react';

interface Birthub360LogoProps {
  variant?: 'full' | 'symbol' | 'with-subtitle';
  theme?: 'dark' | 'light' | 'blue';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Birthub360Logo: React.FC<Birthub360LogoProps> = ({
  variant = 'with-subtitle',
  theme = 'dark',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { symbolH: 22, textH: 'text-lg', subH: 'text-[9px]' },
    md: { symbolH: 30, textH: 'text-2xl', subH: 'text-[11px]' },
    lg: { symbolH: 40, textH: 'text-3xl', subH: 'text-xs' },
    xl: { symbolH: 52, textH: 'text-4xl', subH: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Colors based on Birth Hub 360 Brand Manual
  const primaryGold = '#D4AF37';
  const textFill = theme === 'light' ? '#0B132B' : '#FFFFFF';
  const subtitleColor = theme === 'light' ? '#666666' : '#94A3B8';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Birth Hub 360 Symbol */}
      <svg
        height={currentSize.symbolH}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <circle cx="60" cy="60" r="50" fill={theme === 'dark' ? '#C69B52' : primaryGold} />
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="40"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          B
        </text>
      </svg>

      {variant !== 'symbol' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${currentSize.textH}`}
              style={{ color: textFill, fontFamily: 'Fivo Sans, Montserrat, sans-serif' }}
            >
              Birth Hub 360
            </span>
          </div>
          {variant === 'with-subtitle' && (
            <span
              className={`font-medium tracking-wide mt-0.5 ${currentSize.subH}`}
              style={{ color: subtitleColor }}
            >
              Intelligent Business Command Center
            </span>
          )}
        </div>
      )}
    </div>
  );
};
