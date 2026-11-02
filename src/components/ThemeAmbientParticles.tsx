import React, { useMemo } from 'react';
import { useSeasonalTheme } from '../context/ThemeContext';

export const ThemeAmbientParticles: React.FC = () => {
  const { themeConfig, showAmbientEffects } = useSeasonalTheme();

  const particleIcons = useMemo(() => {
    switch (themeConfig.particleType) {
      case 'ghosts':
        return ['🎃', '🦇', '👻', '🕷️', '🍬'];
      case 'snow':
        return ['❄️', '❅', '✨', '⭐', '🎄'];
      case 'fireworks':
        return ['🎆', '🌟', '✨', '⚡', '💫'];
      case 'leaves':
        return ['🍂', '🍁', '🌰', '🌾'];
      case 'petals':
        return ['🌸', '🌺', '🍃', '✨'];
      default:
        return ['⚡', '✦', '✧', '⬡'];
    }
  }, [themeConfig.particleType]);

  // Generate a small, deterministic array of particles
  const particles = useMemo(() => {
    if (!showAmbientEffects) return [];
    return Array.from({ length: 12 }).map((_, i) => {
      const left = (i * 8.3 + (i % 3) * 2.5) % 96 + 2; // Spread across 2% - 98%
      const duration = 12 + (i % 5) * 3; // 12s - 24s
      const delay = (i * 1.5) % 10;
      const size = 14 + (i % 4) * 4;
      const opacity = 0.22 + (i % 3) * 0.12;
      const icon = particleIcons[i % particleIcons.length];
      return {
        id: i,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        size: `${size}px`,
        opacity,
        icon,
      };
    });
  }, [showAmbientEffects, particleIcons]);

  if (!showAmbientEffects || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="seasonal-particle"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
};
