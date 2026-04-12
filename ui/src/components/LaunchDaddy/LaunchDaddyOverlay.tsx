import { useMemo } from 'react';
import { useLaunchDaddy } from './useLaunchDaddy';

interface Particle {
  id: number;
  tx: number;
  ty: number;
  type: string;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * 360 * (Math.PI / 180);
    const distance = 100 + Math.random() * 400;
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      type: ['fire', 'spark', 'ember'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 0.3,
      duration: 0.8 + Math.random() * 0.7,
      startX: 45 + Math.random() * 10,
      startY: 55 + Math.random() * 10,
    };
  });
}

interface ExplosionContentProps {
  phrase: string;
  subtitle: string;
}

function ExplosionContent({ phrase, subtitle }: ExplosionContentProps) {
  // Memoize particles for this specific mount
  const particles = useMemo(() => generateParticles(50), []);

  return (
    <>
      {/* Fire border effect */}
      <div className="launch-daddy-fire-border" />

      {/* Explosion flash and rings */}
      <div className="launch-daddy-explosion">
        <div className="launch-daddy-explosion__flash" />
        <div className="launch-daddy-explosion__ring" />
        <div className="launch-daddy-explosion__ring" />
        <div className="launch-daddy-explosion__ring" />

        {/* Particle system */}
        <div className="launch-daddy-explosion__particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`launch-daddy-particle launch-daddy-particle--${particle.type}`}
              style={
                {
                  left: `${particle.startX}%`,
                  top: `${particle.startY}%`,
                  '--tx': `${particle.tx}px`,
                  '--ty': `${particle.ty}px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      {/* Stratosphere launch */}
      <div className="launch-daddy-stratosphere">
        <div className="launch-daddy-stratosphere__ball" />
        <div className="launch-daddy-stratosphere__text">{phrase}</div>
        <div className="launch-daddy-stratosphere__subtitle">{subtitle}</div>
      </div>
    </>
  );
}

export function LaunchDaddyOverlay() {
  const { isExploding, isLaunchDaddyMode, explosionId, explosionData } = useLaunchDaddy();

  if (!isLaunchDaddyMode || !isExploding || !explosionData) return null;

  return (
    <ExplosionContent 
      key={explosionId}
      phrase={explosionData.phrase}
      subtitle={explosionData.subtitle}
    />
  );
}
