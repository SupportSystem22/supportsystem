import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withTagline?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  withTagline = false,
  animated = false,
  className = '',
  onClick,
}) => {
  // Dimension mappings
  const dimensions = {
    sm: { icon: 34, font: 'text-base', dotScale: 0.8 },
    md: { icon: 44, font: 'text-lg', dotScale: 1 },
    lg: { icon: 72, font: 'text-2xl', dotScale: 1.5 },
    xl: { icon: 140, font: 'text-4xl', dotScale: 2.2 },
  };

  const currentDim = dimensions[size];

  // Mathematical concentric ring generator matching the brand mark's radial stippling
  const renderConcentricDots = () => {
    const rings = 12;
    const elements: React.JSX.Element[] = [];

    // Central solid core
    elements.push(
      <circle
        key="core"
        cx="100"
        cy="100"
        r="14"
        fill="#dc3c1c"
      />
    );

    // Concentric dot rings with expanding radius and varying dot sizes
    for (let r = 1; r <= rings; r++) {
      const radius = 14 + r * 6.5;
      const dotCount = Math.floor(10 + r * 5.8);
      const dotRadius = Math.max(0.6, 2.2 - (r * 0.12));
      const opacity = Math.max(0.45, 1 - (r * 0.045));

      for (let i = 0; i < dotCount; i++) {
        const angle = (i * 2 * Math.PI) / dotCount;
        const cx = 100 + radius * Math.cos(angle);
        const cy = 100 + radius * Math.sin(angle);

        elements.push(
          <circle
            key={`ring-${r}-dot-${i}`}
            cx={cx.toFixed(2)}
            cy={cy.toFixed(2)}
            r={dotRadius.toFixed(2)}
            fill="#e03e1b"
            fillOpacity={opacity.toFixed(2)}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.01]' : ''} ${className}`}
    >
      {/* Concentric Radial Dot Icon */}
      <div
        className={`relative flex items-center justify-center flex-shrink-0 ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ width: currentDim.icon, height: currentDim.icon }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(220,60,28,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="rotate(0 100 100)">
            {renderConcentricDots()}
          </g>
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline tracking-tight font-bold text-[#1a1918]">
            <span className={currentDim.font}>Support</span>
            <span className={`${currentDim.font} text-[#dc3c1c] font-extrabold`}>System</span>
          </div>
          {withTagline && (
            <p className="text-[10px] sm:text-[11px] font-medium text-[#786f66] tracking-wide">
              Find your way back to yourself.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
